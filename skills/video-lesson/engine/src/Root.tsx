import React from 'react';
import {Composition} from 'remotion';
import {FPS} from './ds';
import {DUR, Poster, Stage} from './current';
// current.ts is rewritten by scripts/stage.sh to point at the lesson being rendered.
export const Root: React.FC = () => (<>
  <Composition id="Stage" component={Stage} durationInFrames={Math.ceil(DUR * FPS)} fps={FPS} width={1920} height={1080} />
  <Composition id="Poster" component={Poster} durationInFrames={1} fps={30} width={1920} height={1080} />
</>);
