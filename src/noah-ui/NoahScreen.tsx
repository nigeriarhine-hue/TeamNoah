import React from 'react';
import {Img, staticFile} from 'remotion';
import {ActionScreen, ApprovalScreen, DiagnosisScreen, ResultScreen} from './screens';
import {NOAH_UI_SCREENSHOTS, type NoahScreenId} from './uiAssets';

const CODED: Record<NoahScreenId, React.FC> = {
  diagnosis: DiagnosisScreen,
  approval: ApprovalScreen,
  action: ActionScreen,
  result: ResultScreen,
};

/**
 * Renders a Noah screen: a real capture from `public/noah-ui/` if one has been
 * registered in `uiAssets.ts`, otherwise the coded screen. Same box either way,
 * so swapping in captures never disturbs the camera moves.
 */
export const NoahScreen: React.FC<{id: NoahScreenId}> = ({id}) => {
  const shot = NOAH_UI_SCREENSHOTS[id];
  if (shot) {
    return (
      <Img
        src={staticFile(shot)}
        style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}}
      />
    );
  }
  const Coded = CODED[id];
  return <Coded />;
};
