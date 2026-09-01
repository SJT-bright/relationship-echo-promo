import React from 'react';
import {Composition} from 'remotion';
import {RelationshipEchoPromo} from './Video';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="RelationshipEchoPromoBgm"
      component={RelationshipEchoPromo}
      durationInFrames={1200}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{includeBgm: true}}
    />
    <Composition
      id="RelationshipEchoPromoNoBgm"
      component={RelationshipEchoPromo}
      durationInFrames={1200}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{includeBgm: false}}
    />
  </>
);
