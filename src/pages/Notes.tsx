import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, Mic, Image as ImageIcon, Send, ChevronDown, 
  Map, Loader2, StopCircle, Play, Trash2
} from "lucide-react";
import { api } from "../services/api";
import { Trip, TripNote } from "../types";
import { format } from "date-fns";

export default function Notes() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>("");
  const [notes, setNotes] = useState<TripNote[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Note input states
  const [textContent, setTextContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadTrips() {
      try {
        const data = await api.getTrips();
        setTrips(data);
        if (data.length > 0) {
          setSelectedTripId(data[0].id.toString());
        }
      } catch (error) {
        console.error("Failed to load trips", error);
      } finally {
        setLoading(false);
      }
    }
    loadTrips();
  }, []);

  useEffect(() => {
    if (!selectedTripId) return;
    async function loadNotes() {
      try {
        const data = await api.getNotes(selectedTripId);
        setNotes(data);
      } catch (error) {
        console.error("Failed to load notes", error);
      }
    }
    loadNotes();
  }, [selectedTripId]);

  // Recording Timer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const fileToBase64 = (file: File | Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const submitNote = async (content: string, type: 'text' | 'image' | 'voice') => {
    if (!selectedTripId) return;
    setIsSubmitting(true);
    try {
      const newNote = await api.addNote(selectedTripId, { content, note_type: type });
      setNotes([newNote, ...notes]);
      setTextContent("");
    } catch (error) {
      console.error("Failed to add note", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      await submitNote(base64, 'image');
    } catch (error) {
      console.error("Failed to read image", error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const base64 = await fileToBase64(blob);
        await submitNote(base64, 'voice');
        stream.getTracks().forEach(track => track.stop()); // Stop mic
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to access microphone", error);
      alert("Microphone access is required to record voice notes.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="min-h-screen bg-neutral-50 flex items-center justify-center">Loading notes...</div>;

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-neutral-900 flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                <FileText className="w-7 h-7" />
              </div>
              Travel Notes
            </h1>
            <p className="text-neutral-500 mt-1 text-lg">Jot down texts, save images, and record voice memos.</p>
          </div>
          
          <div className="relative">
            <select 
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="appearance-none bg-white border border-neutral-200 text-neutral-700 font-bold py-3 pl-4 pr-10 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer min-w-[200px]"
            >
              <option value="" disabled>Select a trip</option>
              {trips.map(trip => (
                <option key={trip.id} value={trip.id}>📍 {trip.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-neutral-400 pointer-events-none" />
          </div>
        </div>

        {trips.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] text-center border-2 border-dashed border-neutral-200">
            <Map className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-neutral-800 mb-2">No trips available</h3>
            <p className="text-neutral-500">Plan a trip first to start keeping notes.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Input Composer */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-neutral-100 relative overflow-hidden">
              <AnimatePresence>
                {isSubmitting && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center"
                  >
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                  </motion.div>
                )}
              </AnimatePresence>

              {isRecording ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }} 
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4"
                  >
                    <Mic className="w-8 h-8 text-red-600" />
                  </motion.div>
                  <div className="text-3xl font-mono font-bold text-neutral-800 mb-6">{formatTime(recordingTime)}</div>
                  <button 
                    onClick={stopRecording}
                    className="bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <StopCircle className="w-5 h-5" /> Stop Recording
                  </button>
                </div>
              ) : (
                <>
                  <textarea
                    placeholder="Write a memory, copy a link, or jot down an address..."
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-neutral-800 text-lg resize-none mb-4"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 rounded-xl transition-colors flex items-center gap-2 font-semibold text-sm"
                      >
                        <ImageIcon className="w-5 h-5 text-indigo-500" /> Add Image
                      </button>
                      <button 
                        onClick={startRecording}
                        className="p-3 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 rounded-xl transition-colors flex items-center gap-2 font-semibold text-sm"
                      >
                        <Mic className="w-5 h-5 text-red-500" /> Voice Memo
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => textContent.trim() && submitNote(textContent, 'text')}
                      disabled={!textContent.trim()}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      Post <Send className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Timeline */}
            <div className="space-y-6">
              {notes.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-500 font-medium">No notes yet. Start capturing memories!</p>
                </div>
              ) : (
                notes.map(note => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    key={note.id} 
                    className="bg-white p-6 rounded-[2rem] shadow-sm border border-neutral-100 flex gap-4"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {note.note_type === 'text' && <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600"><FileText className="w-5 h-5" /></div>}
                      {note.note_type === 'image' && <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600"><ImageIcon className="w-5 h-5" /></div>}
                      {note.note_type === 'voice' && <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600"><Mic className="w-5 h-5" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-neutral-900 capitalize">{note.note_type} Note</span>
                        <span className="text-xs font-semibold text-neutral-400">{format(new Date(note.created_at), "MMM d, h:mm a")}</span>
                      </div>
                      
                      {note.note_type === 'text' && (
                        <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed">{note.content}</p>
                      )}
                      
                      {note.note_type === 'image' && (
                        <div className="rounded-2xl overflow-hidden bg-neutral-100 max-h-[400px] inline-block mt-2">
                          <img src={note.content} alt="Travel Note" className="max-w-full max-h-[400px] object-contain" />
                        </div>
                      )}
                      
                      {note.note_type === 'voice' && (
                        <div className="mt-2 bg-neutral-50 p-4 rounded-2xl flex items-center gap-4">
                          <Play className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                          <audio src={note.content} controls className="w-full h-10" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
