import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { INK_COLORS, FONT_STYLES } from "@/lib/mockData";
import { BookOpen, Loader2, CheckCircle, Send, ImagePlus, X, Mic, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SignPage = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<{ id: string; full_name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [senderName, setSenderName] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState(""); 
  const [inkColor, setInkColor] = useState(INK_COLORS[0].value);
  const [fontStyle, setFontStyle] = useState(FONT_STYLES[0].value);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Image upload state
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio record state
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const { toast } = useToast();

  // Play a scribble sound effect
  const playScribble = () => {
    const audio = new Audio('/scribble.mp3');
    audio.volume = 0.3; 
    audio.play().catch(() => {}); 
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) { setNotFound(true); setLoading(false); return; }
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("username", username.toLowerCase())
        .maybeSingle();

      if (!data) {
        setNotFound(true);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [username]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Too big!", description: "Image must be under 5MB.", variant: "destructive" });
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ---- AUDIO RECORDING LOGIC ----
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      toast({ title: "Microphone Error", description: "Please allow microphone access.", variant: "destructive" });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const removeAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };
  // -------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSubmitting(true);

    try {
      let finalImageUrl = null;
      let finalAudioUrl = null;

      // 1. Upload Image to Storage if one was selected
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `img_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('autographs')
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        finalImageUrl = supabase.storage
          .from('autographs')
          .getPublicUrl(fileName).data.publicUrl;
      }

      // 2. Upload Audio to Storage if recorded
      if (audioBlob) {
        const fileName = `audio_${Math.random().toString(36).substring(2)}_${Date.now()}.webm`;
        const { error: audioError } = await supabase.storage
          .from('autographs')
          .upload(fileName, audioBlob);
          
        if (audioError) throw audioError;
        
        finalAudioUrl = supabase.storage
          .from('autographs')
          .getPublicUrl(fileName).data.publicUrl;
      }

      // 3. Save the Message Record
      const { error } = await supabase.from("messages").insert({
        receiver_id: profile.id,
        sender_name: senderName.trim(),
        message_content: messageContent.trim(),
        ink_color: inkColor,
        font_style: fontStyle,
        image_url: finalImageUrl,
        spotify_url: spotifyUrl.trim() || null,
        audio_url: finalAudioUrl, // Added Audio URL
      });

      if (error) throw error;
      setSubmitted(true);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedFont = FONT_STYLES.find((f) => f.value === fontStyle);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Book Not Found</h1>
          <p className="font-body text-muted-foreground">This autograph book doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-6">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="text-center max-w-md"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" strokeWidth={1.5} />
            </motion.div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-3">
              Message Slipped In!
            </h1>
            <p className="font-body text-muted-foreground text-lg">
              Your autograph has been added to {profile?.full_name}'s book. They'll treasure it forever! ✨
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg"
          >
            <div className="paper-texture book-shadow rounded-xl p-6 md:p-8">
              <div className="text-center mb-6">
                <BookOpen className="w-10 h-10 text-primary mx-auto mb-2" strokeWidth={1.5} />
                <h1 className="font-display text-xl md:text-2xl font-bold text-foreground">
                  Leave a message for
                </h1>
                <p className="font-display text-2xl md:text-3xl font-bold text-primary italic mt-1">
                  {profile?.full_name}'s Autograph Book!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="senderName" className="font-body">Your Name</Label>
                  <Input
                    id="senderName"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Your name"
                    required
                    maxLength={50}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="font-body">Your Message</Label>
                  <Textarea
                    id="message"
                    value={messageContent}
                    onChange={(e) => {
                      setMessageContent(e.target.value);
                      if (e.target.value.length % 5 === 0 && e.target.value.length > 0) {
                        playScribble();
                      }
                    }}
                    placeholder="Write something memorable..."
                    required
                    maxLength={500}
                    rows={4}
                    className={`mt-1 ${selectedFont?.className || "font-caveat"} text-lg`}
                    style={{ color: inkColor }}
                  />
                  <p className="text-xs text-muted-foreground mt-1 font-body text-right">
                    {messageContent.length}/500
                  </p>
                </div>

                {/* Media Uploads Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Image Upload */}
                  <div>
                    <Label className="font-body text-xs mb-1 block text-muted-foreground">Add Photo (Optional)</Label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleImageChange}
                    />
                    {!imagePreview ? (
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full border-dashed border-2 bg-transparent hover:bg-secondary/50 font-body h-12"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImagePlus className="w-4 h-4 mr-2" />
                        Photo
                      </Button>
                    ) : (
                      <div className="relative inline-block w-full bg-white p-1 pb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black transform rotate-[-1deg]">
                        <img src={imagePreview} alt="Preview" className="w-full h-16 object-cover rounded-sm border border-gray-200" />
                        <button 
                          type="button"
                          onClick={() => { setImage(null); setImagePreview(null); }}
                          className="absolute -top-3 -right-3 bg-destructive text-white rounded-full p-1 border-2 border-black hover:scale-110 transition-transform"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Audio Upload */}
                  <div>
                    <Label className="font-body text-xs mb-1 block text-muted-foreground">Voice Note (Optional)</Label>
                    {!audioUrl ? (
                      <Button 
                        type="button" 
                        variant={isRecording ? "destructive" : "outline"} 
                        className={`w-full border-dashed border-2 h-12 ${isRecording ? 'animate-pulse bg-red-100 text-red-600 border-red-500' : 'bg-transparent hover:bg-secondary/50'} font-body`}
                        onClick={isRecording ? stopRecording : startRecording}
                      >
                        {isRecording ? <><Square className="w-4 h-4 mr-2 fill-current" /> Stop</> : <><Mic className="w-4 h-4 mr-2" /> Record</>}
                      </Button>
                    ) : (
                      <div className="relative flex items-center justify-center bg-yellow-100 border-2 border-black p-1 pb-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform rotate-1 w-full h-[88px]">
                        <audio src={audioUrl} controls className="w-full h-8 max-w-[150px]" style={{ filter: 'sepia(20%) hue-rotate(10deg) saturate(150%)' }} />
                        <button 
                          type="button" 
                          onClick={removeAudio} 
                          className="absolute -top-3 -right-3 bg-destructive text-white rounded-full p-1 border-2 border-black hover:scale-110 transition-transform z-10"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Spotify URL Section */}
                <div>
                  <Label htmlFor="spotifyUrl" className="font-body">Dedicate a Song (Optional)</Label>
                  <Input
                    id="spotifyUrl"
                    value={spotifyUrl}
                    onChange={(e) => setSpotifyUrl(e.target.value)}
                    placeholder="Paste a Spotify track link here..."
                    className="mt-1 font-typewriter text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1 font-typewriter">
                    E.g., https://open.spotify.com/track/...
                  </p>
                </div>

                {/* Ink Color */}
                <div>
                  <Label className="font-body mb-2 block">Ink Color</Label>
                  <div className="flex gap-3">
                    {INK_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setInkColor(color.value)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          inkColor === color.value
                            ? "border-primary scale-110 shadow-md"
                            : "border-border hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Font Style */}
                <div>
                  <Label className="font-body mb-2 block">Handwriting Style</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {FONT_STYLES.map((font) => (
                      <button
                        key={font.value}
                        type="button"
                        onClick={() => setFontStyle(font.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-center ${
                          fontStyle === font.value
                            ? "border-primary bg-secondary/50"
                            : "border-border hover:border-muted-foreground/30"
                        } ${font.className}`}
                      >
                        <span className="text-lg" style={{ color: inkColor }}>
                          {font.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full font-display text-base py-6"
                  disabled={submitting || !senderName.trim() || !messageContent.trim()}
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Sign the Book
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SignPage;