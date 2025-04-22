import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Typography, Box, CircularProgress, Alert } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';

interface VoiceAssistantProps {
  onCommand: (action: { 
    type: string; 
    params?: { 
      destination?: string;
      arMode?: boolean;
      viewMode?: '2d' | '3d';
      floor?: number;
    } 
  }) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const ws = useRef<WebSocket | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const reconnectTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 2000;
  const navigate = useNavigate();

  const handleReconnect = useCallback(() => {
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      setReconnectAttempts(prev => prev + 1);
      reconnectTimeout.current = setTimeout(() => {
        console.log(`Attempting to reconnect... (${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`);
        connectWebSocket();
      }, RECONNECT_DELAY);
    } else {
      setError('Failed to connect after multiple attempts. Please try again later.');
      setIsConnecting(false);
    }
  }, [reconnectAttempts]);

  const connectWebSocket = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Close existing connection if any
      if (ws.current) {
        ws.current.close();
      }

      ws.current = new WebSocket(config.wsUrl + '/ws/voice');

      ws.current.onopen = () => {
        console.log('WebSocket connected to:', config.wsUrl);
        setIsConnected(true);
        setIsConnecting(false);
        setReconnectAttempts(0);
        setError(null);
      };

      ws.current.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
        setIsListening(false);
        if (event.code !== 1000) { // 1000 is normal closure
          handleReconnect();
        }
      };

      ws.current.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('Connection error occurred. Please check if the server is running.');
        setIsConnected(false);
        setIsListening(false);
      };

      ws.current.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          if (response.status === 'error') {
            setError(response.message);
          } else {
            setTranscript(response.text);
            if (response.intent) {
              handleIntent(response.intent);
            }
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
          setError('Error processing server response');
        }
      };
    } catch (e) {
      console.error('Error creating WebSocket:', e);
      setError(`Failed to establish connection to ${config.wsUrl}. Please check if the server is running.`);
      setIsConnecting(false);
      handleReconnect();
    }
  }, [handleReconnect]);

  const handleIntent = useCallback((response: any) => {
    if (!response || !response.action) {
      console.log('Invalid intent data received:', response);
      return;
    }

    const { action } = response;
    
    switch (action.type) {
      case 'NAVIGATE':
        if (action.params?.destination) {
          onCommand({
            ...action,
            params: {
              ...action.params,
              viewMode: '2d'
            }
          });
        }
        break;
      case 'START_NAVIGATION':
        onCommand(action);
        break;
      case 'CANCEL_NAVIGATION':
        onCommand({ type: 'CANCEL_NAVIGATION' });
        navigate('/');
        break;
      case 'SHOW_HELP':
        onCommand(action);
        break;
      case 'TOGGLE_AR':
        onCommand({
          type: 'TOGGLE_AR',
          params: {
            arMode: true,
            viewMode: '3d'
          }
        });
        break;
      case 'SWITCH_VIEW':
        onCommand({
          type: 'SWITCH_VIEW',
          params: {
            viewMode: action.params?.viewMode || '2d'
          }
        });
        break;
      case 'CHANGE_FLOOR':
        if (action.params?.floor !== undefined) {
          onCommand({
            type: 'CHANGE_FLOOR',
            params: {
              floor: action.params.floor
            }
          });
        }
        break;
      default:
        console.log('Unknown action type:', action.type);
    }
  }, [navigate, onCommand]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close(1000, 'Component unmounting');
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
        mediaRecorder.current.stop();
        mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [connectWebSocket]);

  const startListening = async () => {
    if (!isConnected) {
      setError('Please wait for the connection to be established.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          const base64Data = base64Audio.split(',')[1];
          if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(base64Data);
          } else {
            setError('Connection lost. Please try again.');
            setIsListening(false);
            connectWebSocket(); // Try to reconnect
          }
        };
      };

      mediaRecorder.current.start();
      setIsListening(true);
      setError(null);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Please allow microphone access to use voice commands');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  return (
    <Box sx={{ 
      p: 2, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: 2,
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(0, 0, 0, 0.1)',
      zIndex: 1000
    }}>
      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{ width: '100%', maxWidth: 500 }}
        >
          {error}
        </Alert>
      )}
      
      <Button
        variant="contained"
        color={isListening ? "secondary" : "primary"}
        onClick={toggleListening}
        disabled={!isConnected || isConnecting}
        startIcon={isListening ? <MicOffIcon /> : <MicIcon />}
        sx={{ minWidth: 200 }}
      >
        {isListening ? "Stop" : "Start"} Voice Command
      </Button>

      {isConnecting && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} />
          <Typography>Connecting to voice service...</Typography>
        </Box>
      )}

      {isListening && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} color="secondary" />
          <Typography>Listening...</Typography>
        </Box>
      )}

      {transcript && (
        <Typography variant="body1" sx={{ mt: 1 }}>
          You said: {transcript}
        </Typography>
      )}
    </Box>
  );
};

export default VoiceAssistant; 