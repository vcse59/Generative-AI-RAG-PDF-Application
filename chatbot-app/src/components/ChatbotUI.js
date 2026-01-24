
import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableOpacity,
    useWindowDimensions,
    Text,
    Image
} from 'react-native';
import RenderHTML from 'react-native-render-html';

const ChatbotUI = ({ microserviceHost }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const scrollViewRef = useRef();
    const inputRef = useRef(null);
    const { width } = useWindowDimensions();
    const MarkdownIt = require('markdown-it');
    const md = new MarkdownIt();

    // Process user query and fetch response
    async function processUserQuery(prompt) {
        try {
            const response = await fetch(`${microserviceHost}/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: prompt })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const htmlResponse = md.render(data.response) || "Please try again";
            const citationLinks = data.citation_links.map(link => {
                return `<a href="${link.url}" target="_blank">${link.title}</a>`;
            }).join('<br />'); // Join all citation links with a line break

            // Combine response and citations
            const fullResponse = `${htmlResponse}<br /><strong>Citations:</strong><br />${citationLinks}`;

            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    id: Date.now(),
                    text: fullResponse,
                    sender: 'bot',
                }
            ]);
        } catch (error) {
            console.error("Error fetching response:", error);
        }
    }

    const handleSendMessage = async () => {
        if (inputMessage.trim() === '') return;

        const userQuery = {
            id: Date.now(),
            text: inputMessage.trim(),
            sender: 'user',
        };

        try {
            setMessages((prevMessages) => [...prevMessages, userQuery]);
            setInputMessage("");
            await processUserQuery(inputMessage);
        } catch (error) {
            console.error('Error sending message:', error); 
        }

        Keyboard.dismiss();
        inputRef.current?.focus();
    };


    const renderMessage = (item) => {
        const isUser = item.sender === 'user';
        return (
            <View
                key={item.id}
                style={[
                    styles.messageRow,
                    isUser ? styles.rowUser : styles.rowBot,
                ]}
            >
                {/* For user, push avatar and bubble to the right */}
                {isUser ? (
                    <>
                        <View style={{ flex: 1 }} />
                        <Image
                            source={{ uri: 'https://img.icons8.com/color/48/000000/user-male-circle--v1.png' }}
                            style={styles.avatar}
                        />
                        <View style={[styles.messageBubble, styles.userBubble]}>
                            <RenderHTML contentWidth={width - 100} source={{ html: `<p>${item.text}</p>` }} />
                        </View>
                    </>
                ) : (
                    <>
                        <Image
                            source={{ uri: 'https://img.icons8.com/color/48/000000/robot.png' }}
                            style={styles.avatar}
                        />
                        <View style={[styles.messageBubble, styles.botBubble]}>
                            <RenderHTML contentWidth={width - 100} source={{ html: item.text }} />
                        </View>
                        <View style={{ flex: 1 }} />
                    </>
                )}
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.chatContainer}
        >
            <ScrollView
                ref={scrollViewRef}
                onContentSizeChange={() =>
                    scrollViewRef.current.scrollToEnd({ animated: true })
                }
                style={styles.messagesContainer}
                contentContainerStyle={{ paddingVertical: 20 }}
                showsVerticalScrollIndicator={false}
            >
                {messages.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>Start the conversation!</Text>
                    </View>
                )}
                {messages.map(renderMessage)}
            </ScrollView>

            <View style={styles.inputBarShadow}>
                <View style={styles.inputContainer}>
                    <TextInput
                        ref={inputRef}
                        style={styles.input}
                        value={inputMessage}
                        onChangeText={setInputMessage}
                        placeholder="Type your message..."
                        multiline={false}
                        placeholderTextColor="#aaa"
                        onSubmitEditing={handleSendMessage}
                    />
                    <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                        <Text style={styles.sendButtonText}>➤</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};


const styles = StyleSheet.create({
    chatContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        borderRadius: 15,
        overflow: 'hidden',
    },
    messagesContainer: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: 'transparent',
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    rowUser: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    rowBot: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginHorizontal: 8,
        backgroundColor: '#e0e0e0',
    },
    messageBubble: {
        maxWidth: '75%',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 18,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
    },
    userBubble: {
        backgroundColor: '#0078d4',
        color: '#fff',
        marginLeft: 0,
        marginRight: 8,
    },
    botBubble: {
        backgroundColor: '#f1f1f1',
        color: '#222',
        marginLeft: 8,
        marginRight: 0,
    },
    inputBarShadow: {
        boxShadow: '0 -2px 4px rgba(0,0,0,0.08)',
        backgroundColor: 'transparent',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 30,
        margin: 12,
        paddingHorizontal: 16,
        paddingVertical: 6,
        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: 'transparent',
        borderRadius: 20,
        color: '#222',
    },
    sendButton: {
        backgroundColor: '#0078d4',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 1px 2px rgba(0,120,212,0.15)',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyText: {
        color: '#aaa',
        fontSize: 18,
        fontStyle: 'italic',
    },
});

export default ChatbotUI;