import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, StatusBar, AppRegistry, Platform } from 'react-native';
import ChatbotUI from './components/ChatbotUI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowMinimize, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { MICROSERVICE_HOST_URL as MICROSERVICE_HOST} from '@env';

const App = () => {

  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleChatWindow = () => {
    setIsChatVisible(!isChatVisible);
  };

  const [microserviceHost, setMicroserviceHost] = useState(MICROSERVICE_HOST || null);

  const handleUpdateKnowledgeSource = () => {
    // Sample URL for the update knowledge source action
    const url = `${microserviceHost}/docs`;
    Linking.openURL(url).catch(err => console.error("Failed to open URL", err));
  };

  const [configMessage, setConfigMessage] = useState('');
  const [configMessageType, setConfigMessageType] = useState(''); // 'success' or 'error'

  // Simple URL validation (http/https and non-empty)
  const isValidHost = (host) => {
    try {
      const url = new URL(host.startsWith('http') ? host : `http://${host}`);
      return !!url.hostname;
    } catch {
      return false;
    }
  };

  const handleConfigure = () => {
    if (!microserviceHost || !isValidHost(microserviceHost)) {
      setConfigMessage('Please enter a valid microservice host URL.');
      setConfigMessageType('error');
      return;
    }
    setConfigMessage('Microservice host configured successfully!');
    setConfigMessageType('success');
  };

  // Ensure chat window is hidden if microserviceHost is null
  useEffect(() => {
    if (!microserviceHost) {
      setIsChatVisible(false);
    }
  }, [microserviceHost]);

  return (
    <>
      <View style={styles.outerContainer}>
        <View style={styles.centerColumn}>
          <Text style={styles.welcomeText}>
            Welcome to <Text style={{ color: '#010b13', fontWeight: 'bold' }}>RAG</Text> (Retrieval-augmented generation) based chat app
            <Text style={{ fontWeight: 'normal', color: '#222' }}> using PDF as knowledge source</Text>
          </Text>
          {microserviceHost && (
            <TouchableOpacity
              onPress={handleUpdateKnowledgeSource}
              style={styles.updateKnowledgeSourceButton}
              disabled={!microserviceHost}
            >
              <Text style={styles.updateText}>Add Knowledge Source</Text>
            </TouchableOpacity>
          )}
          {isChatVisible && microserviceHost && (
            <View style={styles.chatCardFixed}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatTitle}>Chat with Us</Text>
                <View style={styles.chatHeaderActions}>
                  <TouchableOpacity onPress={toggleChatWindow} style={styles.minimizeButton}>
                    <FontAwesomeIcon icon={faWindowMinimize} size="2x" color="#0078d4" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={toggleChatWindow} style={styles.closeButton}>
                    <FontAwesomeIcon icon={faCircleXmark} size="2x" color="#0078d4" />
                  </TouchableOpacity>
                </View>
              </View>
              <ChatbotUI microserviceHost={microserviceHost} />
            </View>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.chatButton,
            (!microserviceHost ? { opacity: 0.5 } : {})
          ]}
          onPress={() => {
            if (microserviceHost) setIsChatVisible(true);
          }}
          disabled={!microserviceHost}
        >
          <Text style={styles.chatIcon}>💬</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#1492c1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 48,
    marginBottom: 48,
    width: '100%',
    maxWidth: 600,
  },
  welcomeText: {
    fontWeight: 'bold',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 32,
    color: '#222',
    lineHeight: 36,
  },
  chatButton: {
    position: 'fixed',
    bottom: 32,
    right: 32,
    backgroundColor: '#0078d4',
    padding: 16,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 16px rgba(0,120,212,0.15)',
    zIndex: 100,
  },
  chatIcon: {
    color: '#fff',
    fontSize: 28,
  },
  centeredRow: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginTop: 32,
  },
  welcomeText: {
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 16,
  },
  chatCardFixed: {
    position: 'fixed',
    bottom: 96,
    right: 48,
    width: 400,
    minHeight: 500,
    backgroundColor: '#dae7ec',
    borderRadius: 18,
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: '1px solid #b2cbe4',
    zIndex: 200,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensures space between title and actions
    padding: 5,
    backgroundColor: '#dae7ec', // Optional styling
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1, // Ensures the title takes up remaining space
  },
  chatHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  minimizeButton: {
    marginRight: 20, // Adds spacing between minimize and close buttons
    marginBottom: 30
  },
  updateKnowledgeSourceButton: {
    backgroundColor: '#0078d4',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginBottom: 24,
    marginTop: 0,
    shadowColor: '#0078d4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  updateText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    marginBottom: 20
  }
});

export default App;
