// Example content of the file with modifications

function getMessageWidth(isUser: boolean): number {
    // Modifying width values to make dialog boxes thinner
    return isUser ? 150 : 140; // Thinner widths for user and AI messages
}

const styles = {
    messageContainer: {
        // Adjusting padding and margins
        padding: '5px', // Reduced padding
        marginBottom: '5px', // Reduced margin
    },
    timestamp: {
        margin: '0', // Remove margin to reduce space between timestamp and text
    }
};

// ... rest of the component code
