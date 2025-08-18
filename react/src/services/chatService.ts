import jsPDF from 'jspdf';

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  messages: Message[];
}

export interface ShareableChatData {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
  isPublic: boolean;
}

export class ChatService {
  private static readonly STORAGE_KEY = 'sefgh-chat-sessions';
  private static readonly SHARED_CHATS_KEY = 'sefgh-shared-chats';

  // Generate title from first user message
  static generateChatTitle(messages: Message[]): string {
    const firstUserMessage = messages.find(msg => msg.type === 'user');
    if (!firstUserMessage) return 'New Chat';
    
    // Take first 50 characters and clean up
    let title = firstUserMessage.content.slice(0, 50).trim();
    if (firstUserMessage.content.length > 50) {
      title += '...';
    }
    
    // Remove newlines and extra spaces
    title = title.replace(/\s+/g, ' ');
    
    return title || 'New Chat';
  }

  // Save a chat session with duplication check
  static saveChatSession(messages: Message[]): ChatSession {
    if (messages.length === 0) {
      throw new Error('Cannot save empty chat session');
    }

    const sessions = this.getChatSessions();
    const lastMessage = messages[messages.length - 1];
    
    // Generate unique ID based on message content to prevent duplicates
    const contentHash = this.generateContentHash(messages);
    
    // Check if a session with similar content already exists
    const existingSession = sessions.find(session => 
      this.generateContentHash(session.messages) === contentHash
    );
    
    if (existingSession) {
      // Update existing session instead of creating duplicate
      existingSession.timestamp = new Date();
      existingSession.messageCount = messages.length;
      existingSession.messages = messages.map(msg => ({ ...msg }));
      existingSession.lastMessage = lastMessage.content.slice(0, 100) + (lastMessage.content.length > 100 ? '...' : '');
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions));
      return existingSession;
    }
    
    const session: ChatSession = {
      id: Math.random().toString(36).substr(2, 9),
      title: this.generateChatTitle(messages),
      lastMessage: lastMessage.content.slice(0, 100) + (lastMessage.content.length > 100 ? '...' : ''),
      timestamp: new Date(),
      messageCount: messages.length,
      messages: messages.map(msg => ({ ...msg })) // Deep copy
    };

    sessions.unshift(session); // Add to beginning
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions));
    
    return session;
  }

  // Generate content hash for deduplication
  private static generateContentHash(messages: Message[]): string {
    const content = messages.map(msg => `${msg.type}:${msg.content}`).join('|');
    return btoa(content).slice(0, 16); // Simple hash
  }

  // Get all chat sessions
  static getChatSessions(): ChatSession[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const sessions = JSON.parse(stored);
      return sessions.map((session: any) => ({
        ...session,
        timestamp: new Date(session.timestamp),
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
      return [];
    }
  }

  // Delete a chat session
  static deleteChatSession(sessionId: string): void {
    const sessions = this.getChatSessions();
    const filteredSessions = sessions.filter(session => session.id !== sessionId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredSessions));
  }

  // Search chat sessions
  static searchChatSessions(query: string): ChatSession[] {
    const sessions = this.getChatSessions();
    const lowerQuery = query.toLowerCase().trim();
    
    if (!lowerQuery) return sessions;
    
    return sessions.filter(session => 
      session.title.toLowerCase().includes(lowerQuery) ||
      session.lastMessage.toLowerCase().includes(lowerQuery) ||
      session.messages.some(msg => 
        msg.content.toLowerCase().includes(lowerQuery)
      )
    );
  }

  // Export chat as TXT
  static exportAsTxt(session: ChatSession): void {
    const content = [
      `Chat Export: ${session.title}`,
      `Exported on: ${new Date().toLocaleString()}`,
      `Message Count: ${session.messageCount}`,
      '=' .repeat(50),
      '',
      ...session.messages.map(msg => [
        `[${msg.timestamp.toLocaleString()}] ${msg.type.toUpperCase()}:`,
        msg.content,
        ''
      ].join('\n'))
    ].join('\n');

    this.downloadFile(content, `${session.title}.txt`, 'text/plain');
  }

  // Export chat as Markdown
  static exportAsMarkdown(session: ChatSession): void {
    const content = [
      `# ${session.title}`,
      '',
      `**Exported on:** ${new Date().toLocaleString()}`,
      `**Message Count:** ${session.messageCount}`,
      '',
      '---',
      '',
      ...session.messages.map(msg => [
        `## ${msg.type === 'user' ? '👤 User' : '🤖 Assistant'}`,
        `*${msg.timestamp.toLocaleString()}*`,
        '',
        msg.content,
        ''
      ].join('\n'))
    ].join('\n');

    this.downloadFile(content, `${session.title}.md`, 'text/markdown');
  }

  // Export chat as JSON
  static exportAsJson(session: ChatSession): void {
    const exportData = {
      id: session.id,
      title: session.title,
      exportedAt: new Date().toISOString(),
      messageCount: session.messageCount,
      timestamp: session.timestamp.toISOString(),
      messages: session.messages.map(msg => ({
        id: msg.id,
        type: msg.type,
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }))
    };

    const content = JSON.stringify(exportData, null, 2);
    this.downloadFile(content, `${session.title}.json`, 'application/json');
  }

  // Export chat as PDF
  static exportAsPdf(session: ChatSession): void {
    const pdf = new jsPDF();
    const pageHeight = pdf.internal.pageSize.height;
    let y = 20;
    
    // Title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(session.title, 20, y);
    y += 10;
    
    // Metadata
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Exported on: ${new Date().toLocaleString()}`, 20, y);
    y += 5;
    pdf.text(`Message Count: ${session.messageCount}`, 20, y);
    y += 15;
    
    // Messages
    session.messages.forEach((msg, index) => {
      if (y > pageHeight - 40) {
        pdf.addPage();
        y = 20;
      }
      
      // Message header
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      const header = `${msg.type === 'user' ? 'User' : 'Assistant'} - ${msg.timestamp.toLocaleString()}`;
      pdf.text(header, 20, y);
      y += 8;
      
      // Message content
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      const lines = pdf.splitTextToSize(msg.content, 170);
      
      lines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          pdf.addPage();
          y = 20;
        }
        pdf.text(line, 20, y);
        y += 5;
      });
      
      y += 10; // Space between messages
    });

    pdf.save(`${session.title}.pdf`);
  }

  // Create shareable link
  static createShareableLink(session: ChatSession): string {
    const shareData: ShareableChatData = {
      id: Math.random().toString(36).substr(2, 9),
      title: session.title,
      messages: session.messages,
      timestamp: session.timestamp,
      isPublic: true
    };

    // Store in localStorage (in a real app, this would be sent to a server)
    const sharedChats = this.getSharedChats();
    sharedChats[shareData.id] = shareData;
    localStorage.setItem(this.SHARED_CHATS_KEY, JSON.stringify(sharedChats));

    // Return shareable URL
    const baseUrl = window.location.origin;
    return `${baseUrl}/shared/${shareData.id}`;
  }

  // Get shared chat data
  static getSharedChat(shareId: string): ShareableChatData | null {
    try {
      const sharedChats = this.getSharedChats();
      const chatData = sharedChats[shareId];
      
      if (!chatData) return null;
      
      return {
        ...chatData,
        timestamp: new Date(chatData.timestamp),
        messages: chatData.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      };
    } catch (error) {
      console.error('Failed to load shared chat:', error);
      return null;
    }
  }

  // Helper methods
  private static getSharedChats(): Record<string, ShareableChatData> {
    try {
      const stored = localStorage.getItem(this.SHARED_CHATS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  // Export all chats as a single archive (JSON format)
  static exportAllChats(): void {
    const sessions = this.getChatSessions();
    if (sessions.length === 0) {
      throw new Error('No chat sessions to export');
    }

    const exportData = {
      exportedAt: new Date().toISOString(),
      chatCount: sessions.length,
      sessions: sessions.map(session => ({
        id: session.id,
        title: session.title,
        timestamp: session.timestamp.toISOString(),
        messageCount: session.messageCount,
        lastMessage: session.lastMessage,
        messages: session.messages.map(msg => ({
          id: msg.id,
          type: msg.type,
          content: msg.content,
          timestamp: msg.timestamp.toISOString()
        }))
      }))
    };

    const content = JSON.stringify(exportData, null, 2);
    this.downloadFile(content, `all-chats-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  }
}