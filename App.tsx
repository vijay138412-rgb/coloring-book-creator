
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateImage, startChat } from './services/geminiService';
import { createColoringBookPdf } from './services/pdfService';
import Chatbot from './components/Chatbot';
import DrawingModal from './components/DrawingModal';
import type { ChatMessage } from './types';
import { DownloadIcon, SparklesIcon, InfoIcon, MagicWandIcon, ColorPaletteIcon, DoodleBackground, DinosaurIcon, UnicornIcon, RocketIcon, CrayonsIcon, CheckIcon, EditIcon, ImageIcon } from './components/Icons';
import { translations, bookTypesData, coverStylesData, lineStylesData, customElementPlaceholdersData, themePlaceholdersData } from './translations';
import type { Chat } from '@google/genai';

interface GeneratedPage {
  image: string; // base64 string
  label: string;
  history?: ImageData[];
}

type BookType = 'theme' | 'alphabet' | 'numbers' | 'fairytales' | 'jungle' | 'sea' | 'vehicles' | 'fantasy';
type LineStyle = 'thick' | 'dotted' | 'dashed';
type Language = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'ru';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [childName, setChildName] = useState('');
  const [bookType, setBookType] = useState<BookType>('theme');
  const [theme, setTheme] = useState(themePlaceholdersData.en[0]);
  const [customElements, setCustomElements] = useState('');
  const [numPages, setNumPages] = useState(5);
  const [coverStyle, setCoverStyle] = useState('ornate and fancy filigree');
  const [lineStyle, setLineStyle] = useState<LineStyle>('thick');
  const [generatedImages, setGeneratedImages] = useState<(GeneratedPage | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [showDownloadToast, setShowDownloadToast] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });

  // Drawing Modal State
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<{ index: number; image: string; history?: ImageData[] } | null>(null);

  // Chat state
  const chatRef = useRef<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  
  const t = useCallback((key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key];
  }, [language]);

  useEffect(() => {
    chatRef.current = startChat();
    setChatMessages([
      { role: 'model', parts: [{ text: t('chatbotWelcome') }] },
    ]);
  }, [t]);

  useEffect(() => {
    if (isLoading && progress.total > 0) {
        setLoadingMessage(`${t('generating')}... (${progress.completed}/${progress.total})`);
    }
  }, [progress, isLoading, t]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName) {
      setError(t('errorEnterName'));
      return;
    }
    
    if (bookType === 'theme' && !theme) {
        setError(t('errorEnterTheme'));
        return;
    }

    setIsLoading(true);
    setIsFinished(false);
    setError(null);
    setGeneratedImages([]);

    const styleGuide = `Style Guide: MUST be a black and white line art coloring page for a child. The image aspect ratio MUST be 3:4 (portrait). The lines MUST be very ${lineStyle}. There should be NO color, NO shading, NO gray, and NO complex details. The style should be simple and clean. Negative prompts: color, grayscale, shading, shadows, complex textures.`;
    
    let prompts: { type: string, text: string }[] = [];
    const customElementText = customElements ? ` Also include these specific elements: ${customElements}.` : '';

    switch (bookType) {
        case 'theme': {
            const pagePromptTemplates = [
              `Show a friendly character from the theme waving hello.`,
              `Depict a scene with two characters from the theme playing together.`,
              `Show a character from the theme discovering something exciting.`,
              `Draw a character from the theme sleeping peacefully.`,
              `Create a fun action scene with a character from the theme.`,
              `Illustrate a character from the theme eating their favorite food.`,
              `Show a character building something, like a sandcastle or a block tower.`,
              `Draw a character from the theme dancing happily.`,
              `Create a picture of a character from the theme looking at the stars.`,
              `Depict a character reading a book.`,
              `Show a character from the theme having a picnic.`,
              `Draw a character from the theme driving a fun vehicle.`,
              `Create a picture of a character from the theme wearing a silly hat.`,
              `Depict a character hiding behind a plant or object.`,
              `Illustrate a character from the theme singing a song with music notes.`,
              `Show a character from the theme juggling some items.`,
              `Create a fun scene with a character from the theme celebrating a birthday with a cake.`,
              `Draw a character from the theme flying a kite.`,
              `Draw a character from the theme painting a picture on an easel.`,
              `Depict a scene with a character from the theme looking at their reflection in the water.`
            ];
            prompts.push({ type: 'Cover', text: `A coloring book cover with the title "${childName}'s ${theme} Adventure". It should have a decorative border with a '${coverStyle}' theme. It should feature a central character related to the theme '${theme}'.${customElementText} ${styleGuide}`});
            for (let i = 0; i < numPages; i++) {
                prompts.push({
                    type: `Page ${i + 1}`,
                    text: `A coloring book page for a child on the theme of "${theme}". ${pagePromptTemplates[i % pagePromptTemplates.length]}${customElementText} ${styleGuide}`
                });
            }
            break;
        }
        case 'alphabet': {
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            prompts.push({ type: 'Cover', text: `A coloring book cover with the title "${childName}'s Alphabet Book". It should have a decorative border with a '${coverStyle}' theme. It should feature a collage of letters and simple, friendly animals. ${styleGuide}`});
            alphabet.forEach(letter => {
                prompts.push({
                    type: `Page ${letter}`,
                    text: `A coloring book page for a child. The theme is the letter '${letter}'. Show a large, clear, bubble-style letter '${letter}' that can be colored in. Next to it, draw a simple object that starts with '${letter}' (e.g., A for Apple, B for Ball). ${styleGuide}`
                });
            });
            break;
        }
        case 'numbers': {
            prompts.push({ type: 'Cover', text: `A coloring book cover with the title "${childName}'s 1 to 100 Book". It should have a decorative border with a '${coverStyle}' theme. It should feature a collage of fun, friendly numbers. ${styleGuide}` });
            for (let i = 1; i <= 100; i++) {
              prompts.push({
                type: `Page ${i}`,
                text: `A coloring book page for a child. The theme is the number '${i}'. Show a large, clear, bubble-style number '${i}' that can be colored in. Surround the number with ${i} simple objects (e.g., ${i} stars or ${i} happy faces). ${styleGuide}`
              });
            }
            break;
        }
        case 'fairytales':
        case 'jungle':
        case 'sea':
        case 'vehicles':
        case 'fantasy': {
            const data = bookTypesData[language].find(b => b.id === bookType);
            if (!data || !data.prompts) break;
            prompts.push({ type: 'Cover', text: `${data.coverPrompt.replace('{childName}', childName).replace('{coverStyle}', coverStyle)} ${styleGuide}` });
            for (let i = 0; i < numPages; i++) {
                prompts.push({ type: `Page ${i + 1}`, text: `A coloring book page for a child with a theme: ${data.prompts[i % data.prompts.length]}. ${styleGuide}`});
            }
            break;
        }
        default:
            setError("Invalid book type selected.");
            setIsLoading(false);
            return;
    }
    
    setGeneratedImages(Array(prompts.length).fill(null));
    setProgress({ completed: 0, total: prompts.length });

    try {
        const BATCH_SIZE = 5;
        for (let i = 0; i < prompts.length; i += BATCH_SIZE) {
            const batchPrompts = prompts.slice(i, i + BATCH_SIZE);
            const batchPromises = batchPrompts.map((prompt, batchIndex) => {
                const originalIndex = i + batchIndex;
                return (async () => {
                    try {
                        const image = await generateImage(prompt.text);
                        const newPage: GeneratedPage = { image, label: prompt.type };
                        setGeneratedImages(prev => {
                            const newImages = [...prev];
                            newImages[originalIndex] = newPage;
                            return newImages;
                        });
                    } catch (err) {
                        console.error(`Error generating image for prompt: "${prompt.text}"`, err);
                        throw err;
                    } finally {
                        setProgress(prev => ({ ...prev, completed: prev.completed + 1 }));
                    }
                })();
            });
            await Promise.all(batchPromises);
        }

        setIsFinished(true);
    } catch (err) {
        let errorMessage: React.ReactNode = t('errorGeneric');
        const errorString = err instanceof Error ? err.message : String(err);
      
        if (errorString.toLowerCase().includes('quota') || errorString.includes('429')) {
            let baseMessage = t('errorQuota');
            if (errorString.includes('limit: 0')) {
              baseMessage += t('errorQuotaLimit0');
            }
            errorMessage = (
              <>
                <p>{baseMessage}</p>
                <p className="mt-2">
                  You can monitor your usage and check your billing here:
                  <br />
                  <a href="https://ai.dev/usage?tab=rate-limit" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{t('errorMonitorUsage')}</a>
                  {' | '}
                  <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{t('errorBillingInfo')}</a>
                </p>
              </>
            );
        }
        setError(errorMessage);
        console.error(err);
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
        // Keep progress at 100% on completion/failure
        if (prompts.length > 0) {
            setProgress({ completed: prompts.length, total: prompts.length });
        } else {
            setProgress({ completed: 0, total: 0 });
        }
    }
  };

  const handleDownloadPdf = async () => {
    let title = `${childName}_${theme}`;
    const bookData = bookTypesData.en.find(b => b.id === bookType);
    if(bookData?.title) {
        title = `${childName}_${bookData.title.replace(/\s+/g, '_')}`;
    }

    const imagesToDownload = generatedImages.filter((p): p is GeneratedPage => p !== null).map(p => p.image);

    const success = await createColoringBookPdf(imagesToDownload, title);
    if (success) {
      setShowDownloadToast(true);
      setTimeout(() => setShowDownloadToast(false), 4000);
    } else {
      setError("There was a problem creating the PDF. Please try again.");
    }
  };
  
  const handleSendMessageToChat = async (message: string) => {
    if (!chatRef.current) return;
    
    setChatMessages(prev => [...prev, { role: 'user', parts: [{ text: message }] }]);
    setIsBotTyping(true);

    try {
      const result = await chatRef.current.sendMessage({ message });
      setChatMessages(prev => [...prev, { role: 'model', parts: [{ text: result.text }] }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages(prev => [...prev, { role: 'model', parts: [{ text: "Oops! I'm having a little trouble connecting. Please try again in a moment." }] }]);
    } finally {
      setIsBotTyping(false);
    }
  };

  // Drawing Modal Handlers
  const handleOpenDrawingModal = (index: number) => {
    const page = generatedImages[index];
    if (page) {
      setEditingImage({ index, image: `data:image/png;base64,${page.image}`, history: page.history });
      setIsDrawingModalOpen(true);
    }
  };
  
  const handleCloseDrawingModal = () => {
    setIsDrawingModalOpen(false);
    setEditingImage(null);
  };

  const handleSaveDrawing = (newImageBase64: string, history: ImageData[]) => {
    if (editingImage !== null) {
      const updatedImages = [...generatedImages];
      const page = updatedImages[editingImage.index];
      if (page) {
        updatedImages[editingImage.index] = { ...page, image: newImageBase64, history: history };
        setGeneratedImages(updatedImages);
      }
    }
    handleCloseDrawingModal();
  };

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 md:p-8 flex flex-col items-center relative overflow-hidden">
      <DinosaurIcon className="w-48 h-48 absolute top-10 left-10 opacity-30 -rotate-12 animate-float" />
      <UnicornIcon className="w-40 h-40 absolute bottom-5 right-5 opacity-30 rotate-12 animate-float [animation-delay:-2s]" />
      <RocketIcon className="w-32 h-32 absolute top-1/2 right-20 opacity-30 -rotate-45 animate-float [animation-delay:-4s]" />
      <CrayonsIcon className="w-36 h-36 absolute bottom-1/4 left-10 opacity-30 rotate-45 animate-float [animation-delay:-1s]" />

      <div className="absolute top-4 right-4 z-20">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-md py-1 px-2 shadow-md text-gray-700 focus:ring-2 focus:ring-pink-400 focus:outline-none"
        >
          <option value="en">🇺🇸 English</option>
          <option value="es">🇪🇸 Español</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="de">🇩🇪 Deutsch</option>
          <option value="hi">🇮🇳 हिन्दी</option>
          <option value="ru">🇷🇺 Русский</option>
        </select>
      </div>

      <main className="w-full max-w-4xl mx-auto z-10">
        <header className="text-center mb-8">
            <div className="flex justify-center items-center gap-4">
                <MagicWandIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white/80" />
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white font-fredoka tracking-wide" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.2)' }}>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">{t('title')}</span>
                </h1>
                <ColorPaletteIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white/80" />
            </div>
            <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.2)' }}>
                {t('subtitle')}
            </p>
        </header>

        <form onSubmit={handleGenerate} className="p-6 sm:p-8 bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 relative overflow-hidden">
          <DoodleBackground className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            
            <div className="space-y-6">
                <div>
                    <label className="flex items-center gap-2 text-lg font-bold text-gray-700 mb-2 font-fredoka" htmlFor="childName">
                        {t('childsName')}
                        <div className="relative group">
                            <InfoIcon className="w-4 h-4 text-gray-500 cursor-help" />
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {t('childsNameTooltip')}
                            </span>
                        </div>
                    </label>
                    <input
                        type="text"
                        id="childName"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        placeholder={t('childsNamePlaceholder')}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
                        required
                    />
                </div>

                <div>
                    <label className="flex items-center gap-2 text-lg font-bold text-gray-700 mb-2 font-fredoka" htmlFor="bookType">
                        {t('bookType')}
                        <div className="relative group">
                            <InfoIcon className="w-4 h-4 text-gray-500 cursor-help" />
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-800 text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {t('bookTypeTooltip')}
                            </span>
                        </div>
                    </label>
                    <select
                        id="bookType"
                        value={bookType}
                        onChange={(e) => setBookType(e.target.value as BookType)}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-pink-400 focus:outline-none transition appearance-none bg-white bg-no-repeat bg-right pr-8"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                    >
                        {bookTypesData[language].map(type => (
                        <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                    </select>
                </div>

                <div className={`transition-all duration-300 ${bookType === 'theme' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden pointer-events-none'}`}>
                    <label className="flex items-center gap-2 text-lg font-bold text-gray-700 mb-2 font-fredoka" htmlFor="theme">
                        {t('coloringTheme')}
                         <div className="relative group">
                            <InfoIcon className="w-4 h-4 text-gray-500 cursor-help" />
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-800 text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {t('coloringThemeTooltip')}
                            </span>
                        </div>
                    </label>
                    <select
                        id="theme"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-pink-400 focus:outline-none transition appearance-none bg-white bg-no-repeat bg-right pr-8"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                    >
                        {themePlaceholdersData[language].map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>

                <div className={`transition-all duration-300 ${bookType !== 'alphabet' && bookType !== 'numbers' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden pointer-events-none'}`}>
                    <label className="flex items-center gap-2 text-lg font-bold text-gray-700 mb-2 font-fredoka" htmlFor="numPages">
                        {t('numPages')}
                         <div className="relative group">
                            <InfoIcon className="w-4 h-4 text-gray-500 cursor-help" />
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {t('numPagesTooltip')}
                            </span>
                        </div>
                    </label>
                    <input
                        type="number"
                        id="numPages"
                        value={numPages}
                        onChange={(e) => setNumPages(Math.max(1, Math.min(20, parseInt(e.target.value, 10))))}
                        min="1"
                        max="20"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
                    />
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="flex items-center gap-2 text-lg font-bold text-gray-700 mb-2 font-fredoka" htmlFor="coverStyle">
                        {t('coverStyle')}
                         <div className="relative group">
                            <InfoIcon className="w-4 h-4 text-gray-500 cursor-help" />
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-800 text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {t('coverStyleTooltip')}
                            </span>
                        </div>
                    </label>
                       <select
                           id="coverStyle"
                           value={coverStyle}
                           onChange={(e) => setCoverStyle(e.target.value)}
                           className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-pink-400 focus:outline-none transition appearance-none bg-white bg-no-repeat bg-right pr-8"
                           style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                       >
                         {coverStylesData[language].map(style => (
                           <option key={style.id} value={style.id}>{style.label}</option>
                         ))}
                       </select>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-lg font-bold text-gray-700 mb-2 font-fredoka" htmlFor="lineStyle">
                        {t('lineStyle')}
                         <div className="relative group">
                            <InfoIcon className="w-4 h-4 text-gray-500 cursor-help" />
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-800 text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {t('lineStyleTooltip')}
                            </span>
                        </div>
                    </label>
                       <select
                          id="lineStyle"
                          value={lineStyle}
                          onChange={(e) => setLineStyle(e.target.value as LineStyle)}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-pink-400 focus:outline-none transition appearance-none bg-white bg-no-repeat bg-right pr-8"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                       >
                         {lineStylesData[language].map(style => (
                           <option key={style.id} value={style.id}>{style.label}</option>
                         ))}
                       </select>
                </div>
                
                <div className={`transition-all duration-300 ${bookType === 'theme' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden pointer-events-none'}`}>
                    <label className="flex items-center gap-2 text-lg font-bold text-gray-700 mb-2 font-fredoka" htmlFor="customElements">
                        {t('customElements')}
                        <div className="relative group">
                            <InfoIcon className="w-4 h-4 text-gray-500 cursor-help" />
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-800 text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {t('customElementsTooltip')}
                            </span>
                        </div>
                    </label>
                        <select
                            id="customElements"
                            value={customElements}
                            onChange={(e) => setCustomElements(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-pink-400 focus:outline-none transition appearance-none bg-white bg-no-repeat bg-right pr-8"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                        >
                            <option value="">{customElementPlaceholdersData[language].none}</option>
                            {customElementPlaceholdersData[language].elements.map(el => (
                                <option key={el} value={el}>{el}</option>
                            ))}
                        </select>
                </div>
            </div>

            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-fredoka text-xl shadow-lg"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {loadingMessage || t('creatingMagic')}
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-6 h-6" />
                    {t('generateButton')}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center shadow-md">
            <p className="font-bold">{t('errorOhNo')}</p>
            <div>{error}</div>
          </div>
        )}

        {generatedImages.length > 0 && (
          <div className="mt-8">
            <h2 className="text-3xl font-bold text-center mb-6 text-white font-fredoka" style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.2)' }}>
              {isFinished ? t('yourBookIsReady') : isLoading ? `${loadingMessage}` : ''}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {generatedImages.map((page, index) => (
                    <div key={index} className="relative group aspect-[3/4] rounded-lg shadow-lg border-4 border-white overflow-hidden">
                        {page ? (
                            <div className="w-full h-full cursor-pointer" onClick={() => handleOpenDrawingModal(index)}>
                                <img
                                    src={`data:image/png;base64,${page.image}`}
                                    alt={page.label}
                                    className="w-full h-full object-cover transition-transform transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <EditIcon className="w-10 h-10 text-white" />
                                    <p className="text-white font-bold text-sm mt-1">{t('color')}</p>
                                </div>
                                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded">
                                    {page.label}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full bg-gray-200/50 backdrop-blur-sm flex flex-col items-center justify-center animate-pulse">
                               <ImageIcon className="w-12 h-12 text-gray-400" />
                               <p className="mt-2 text-sm text-gray-500">{t('generating')}...</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {!isLoading && isFinished && generatedImages.filter(Boolean).length > 0 && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleDownloadPdf}
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-4 px-8 rounded-lg hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 transform hover:scale-105 font-fredoka text-xl shadow-lg inline-flex items-center gap-3"
                >
                  <DownloadIcon className="w-6 h-6" />
                  {t('downloadButton')}
                </button>
              </div>
            )}
          </div>
        )}

      </main>
      
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-green-500 text-white py-3 px-6 rounded-full shadow-lg transition-all duration-300 ${showDownloadToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <CheckIcon className="w-6 h-6" />
        <span className="font-semibold">{t('downloadComplete')}</span>
      </div>

      <Chatbot messages={chatMessages} onSendMessage={handleSendMessageToChat} isTyping={isBotTyping} />
      
      <DrawingModal
        isOpen={isDrawingModalOpen}
        onClose={handleCloseDrawingModal}
        imageSrc={editingImage?.image || ''}
        initialHistory={editingImage?.history}
        onSave={handleSaveDrawing}
      />
    </div>
  );
};

export default App;
