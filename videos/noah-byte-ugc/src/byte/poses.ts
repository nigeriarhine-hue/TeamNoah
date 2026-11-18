import { ArmPose, ARM_REST, Pose, POSE_REST } from "./Byte";

const arm = (p: Partial<ArmPose>): ArmPose => ({ ...ARM_REST, ...p });
const pose = (p: Partial<Pose>): Pose => ({ ...POSE_REST, ...p });

// Arm presets (Byte's left arm = frame right when he faces camera)
export const ARMS = {
  rest: ARM_REST,
  phoneHold: arm({ raise: 1.35, spread: 0.32, twist: 0, elbow: 0.55, curl: 0.75, thumb: 0.2 }),
  shrugUp: arm({ raise: 0.35, spread: 1.0, elbow: 1.55, wristZ: -0.4, curl: 0.05 }),
  gestureOpen: arm({ raise: 0.75, spread: 0.55, twist: -0.3, elbow: 1.2, wristZ: -0.2, curl: 0.1 }),
  pointBack: arm({ raise: -0.2, spread: 1.1, twist: 0.4, elbow: 0.5, curl: 1, point: 1 }),
  pointSide: arm({ raise: 0.6, spread: 1.35, twist: 0.2, elbow: 0.25, curl: 1, point: 1 }),
  // wristX = raise + elbow - PI/2 keeps the thumb pointing straight up
  thumbsUp: arm({ raise: 0.95, spread: 0.5, twist: -0.25, elbow: 1.6, wristX: 0.95 + 1.6 - Math.PI / 2, curl: 1, thumb: 1 }),
  // raised thumbs-up near the face (stays visible above the end card)
  thumbsHigh: arm({ raise: 1.25, spread: 0.55, twist: -0.25, elbow: 1.55, wristX: 1.25 + 1.55 - Math.PI / 2, curl: 1, thumb: 1 }),
  pointUpish: arm({ raise: 2.35, spread: 0.45, twist: 0.1, elbow: 0.35, curl: 1, point: 1 }),
  // both hands up, palms open: "why?!"
  whyUp: arm({ raise: 1.0, spread: 0.8, twist: -0.3, elbow: 1.5, wristX: 1.0 + 1.5 - Math.PI / 2 - 0.2, curl: 0.05, thumb: 0.45 }),
  wave: arm({ raise: 0.5, spread: 1.45, twist: 0.2, elbow: 1.5, wristZ: 0.1, curl: 0.0, thumb: 0.6 }),
  chin: arm({ raise: 0.9, spread: 0.15, twist: -0.4, elbow: 2.25, wristX: 0.3, curl: 0.8 }),
  facepalmish: arm({ raise: 1.15, spread: 0.1, twist: -0.5, elbow: 2.3, wristX: 0.4, curl: 0.2 }),
};

export const POSES = {
  rest: POSE_REST,
  hero: pose({ yaw: 0.22, headYaw: -0.12, headRoll: 0.06, headPitch: -0.04, armL: ARMS.wave, armR: ARMS.rest }),
  selfie: pose({ lean: 0.08, headPitch: 0.04, armR: ARMS.phoneHold, armL: ARMS.rest }),
  selfieShrug: pose({ lean: 0.1, headPitch: -0.02, headRoll: -0.1, armR: ARMS.phoneHold, armL: ARMS.shrugUp }),
  selfieFacepalm: pose({ lean: 0.14, headPitch: 0.08, headRoll: 0.08, armR: ARMS.phoneHold, armL: ARMS.facepalmish }),
  selfieThumbs: pose({ lean: 0.06, headRoll: 0.08, headPitch: -0.03, armR: ARMS.phoneHold, armL: ARMS.thumbsUp }),
  confusedLook: pose({ yaw: -0.35, headYaw: 0.25, headRoll: 0.22, headPitch: 0.02, armL: ARMS.pointSide, armR: ARMS.rest }),
  thinking: pose({ headRoll: 0.18, headPitch: -0.08, armL: ARMS.chin, armR: ARMS.rest }),
};
