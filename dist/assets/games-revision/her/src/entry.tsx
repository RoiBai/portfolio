import React from 'react';
import { createRoot } from 'react-dom/client';
import LevelThree from './components/level-three-editor';
import FinalChapter from './components/final-chapter';
import config from './config.json';

// Selected original playable components, with the author's published layer positions.
// No iframe, chapter menu, site navigation, or persistent progress is mounted here.
export function mountHerExperience(element: HTMLElement, part: string) {
  const root = createRoot(element);
  const done = (complete: boolean) => {
    element.dataset.complete = String(complete);
    element.dispatchEvent(new CustomEvent('portfolio:game-experience', {
      bubbles: true, detail: { projectId: 'hersound', part, complete },
    }));
  };
  root.render(<div className="player-level-section">
    {part === 'assemble'
      ? <LevelThree initialConfig={config.levelThreeConfig} playOnly portfolioGuided persistLocal={false} onCompletionChange={done}/>
      : <FinalChapter initialConfig={config.finalChapterConfig} onCompletionChange={done}/>}
  </div>);
  return () => root.unmount();
}
