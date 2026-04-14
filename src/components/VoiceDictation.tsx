import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { toast } from 'sonner';

interface VoiceDictationProps {
  onTranscript: (text: string, category: 'subjective' | 'objective') => void;
}

export const VoiceDictation: React.FC<VoiceDictationProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = 'es-MX';

      recog.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        // Simple heuristic to structure text
        if (transcript.toLowerCase().includes('objetivo')) {
          const parts = transcript.toLowerCase().split('objetivo');
          if (parts[0].includes('subjetivo')) {
             const subParts = parts[0].split('subjetivo');
             onTranscript(subParts[1], 'subjective');
          } else {
             onTranscript(parts[0], 'subjective');
          }
          onTranscript(parts[1], 'objective');
        } else if (transcript.toLowerCase().includes('subjetivo')) {
          const parts = transcript.toLowerCase().split('subjetivo');
          onTranscript(parts[1], 'subjective');
        } else {
          // Default to subjective if no keyword found
          onTranscript(transcript, 'subjective');
        }
      };

      recog.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast.error('Error en el dictado por voz');
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
    } else {
      if (recognition) {
        recognition.start();
        setIsListening(true);
        toast.success('Dictado activado. Diga "Subjetivo" u "Objetivo" para organizar.');
      } else {
        toast.error('El dictado por voz no es compatible con este navegador.');
      }
    }
  };

  return (
    <Button
      variant={isListening ? "destructive" : "secondary"}
      size="sm"
      className="gap-2"
      onClick={toggleListening}
    >
      {isListening ? (
        <>
          <MicOff size={16} />
          Detener Dictado
        </>
      ) : (
        <>
          <Mic size={16} />
          Dictado Inteligente
        </>
      )}
    </Button>
  );
};
