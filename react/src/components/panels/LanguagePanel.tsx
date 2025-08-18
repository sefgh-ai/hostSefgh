import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Check, Globe } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface LanguagePanelProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export const LanguagePanel = ({
  selectedLanguage,
  onLanguageChange,
}: LanguagePanelProps) => {
  const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Globe className="h-6 w-6" />
          Language Settings
        </h1>
        <p className="text-muted-foreground">
          Choose your preferred language for the interface
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {languages.map((language) => (
          <Card
            key={language.code}
            className={`cursor-pointer transition-all hover:bg-muted/50 ${
              selectedLanguage === language.code
                ? 'ring-2 ring-brand bg-brand-muted'
                : ''
            }`}
            onClick={() => onLanguageChange(language.code)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{language.flag}</span>
                  <div>
                    <div className="font-medium">{language.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {language.nativeName}
                    </div>
                  </div>
                </div>
                {selectedLanguage === language.code && (
                  <Badge variant="default" className="gap-1">
                    <Check className="h-3 w-3" />
                    Selected
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">Note</h3>
        <p className="text-sm text-muted-foreground">
          Language changes will affect the interface text. The AI responses will remain in the language you communicate with it.
        </p>
      </div>
      </div>
    </ScrollArea>
  );
};