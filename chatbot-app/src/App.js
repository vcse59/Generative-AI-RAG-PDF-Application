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
      <View style={styles.container}>
        <Text style={{ fontWeight: 'bold', fontSize: 22 }}>Welcome to RAG (Retrieval-augmented generation) based chat app</Text>

        {microserviceHost && <TouchableOpacity
          onPress={handleUpdateKnowledgeSource}
          style={[
            styles.updateKnowledgeSourceButton
          ]}
          disabled={!microserviceHost}
        >
          <Text style={styles.updateText}>Update Knowledge Source</Text>
        </TouchableOpacity>}
        
        {isChatVisible && microserviceHost && (
          <>
            <View style={styles.chatWindow}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatTitle}>Chat with Us</Text>
                <View style={styles.chatHeaderActions}>
                  <TouchableOpacity onPress={toggleChatWindow} style={styles.minimizeButton}>
                    <FontAwesomeIcon icon={faWindowMinimize} size={30} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={toggleChatWindow} style={styles.closeButton}>
                    <FontAwesomeIcon icon={faCircleXmark} size={30} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
              <ChatbotUI microserviceHost={microserviceHost} />
            </View>
          </>
        )}

        {<TouchableOpacity
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
        </TouchableOpacity>}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  chatButton: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    backgroundColor: '#0078d4',
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatIcon: {
    color: '#fff',
    fontSize: 24,
  },
  container: {
    flex: 1,
    marginTop: '2rem',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#1492c1', // Light background for the entire app
  },
  chatWindow: {
    position: 'fixed',
    bottom: 60,
    right: 60,
    height: 500,
    width: 400,
    backgroundColor: '#dae7ec', // Chat window color
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
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
    padding: 10,
    justifySelf: 'flex-start',
    borderRadius: 5,
    marginBottom: 20, // Adds spacing below the button
    marginTop: '12rem'
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
