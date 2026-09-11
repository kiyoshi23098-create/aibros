import { useState } from 'react';
import Onboarding from './components/Onboarding/Onboarding';
import WelcomeScreen from './components/Onboarding/WelcomeScreen';
import ChatLayout from './components/Chat/ChatLayout';
import { getUserName } from './lib/storage';

function getInitialAppState() {
  return getUserName() ? 'welcomeBack' : 'onboarding';
}

export default function App() {
  const [appState, setAppState] = useState(getInitialAppState);

  if (appState === 'onboarding') {
    return <Onboarding onComplete={() => setAppState('chat')} />;
  }

  if (appState === 'welcomeBack') {
    return <WelcomeScreen name={getUserName()} onComplete={() => setAppState('chat')} />;
  }

  return <ChatLayout />;
}
