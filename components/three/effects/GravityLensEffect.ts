import { Effect } from "postprocessing";
import { Uniform, Vector2 } from "three";

const fragment = /* glsl */ `
  uniform vec2 uSphereNdc;
  uniform float uSphereRadius;
  uniform float uLensStrength;
  uniform float uRingWidth;
  uniform float uRingIntensity;
  uniform float uAspect;

  // Screen-space fake geodesic lensing around a projected sphere center.
  // Pulls UVs radially toward the sphere and emits an Einstein-ring glow
  // just outside the silhouette.
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 dir = uv - uSphereNdc;
    dir.x *= uAspect;
    float d = length(dir);
    float R = max(uSphereRadius, 0.0001);

    float falloff = R * R / max(d * d, R * R * 0.25);
    float pull = uLensStrength * falloff;
    vec2 nd = d > 0.00001 ? dir / d : vec2(0.0);
    vec2 warp = nd * pull;
    warp.x /= uAspect;
    vec2 warpedUv = uv - warp;

    float maskOutside = smoothstep(R * 0.95, R * 1.08, d);
    vec2 sampleUv = mix(uv, warpedUv, maskOutside);

    vec3 col = texture2D(inputBuffer, sampleUv).rgb;

    float ringD = abs(d - R * 1.12);
    float ring = exp(-(ringD * ringD) / max(uRingWidth * uRingWidth, 1e-6)) * uRingIntensity;
    ring *= maskOutside;
    col += vec3(1.0, 0.82, 0.58) * ring;

    outputColor = vec4(col, inputColor.a);
  }
`;

export class GravityLensEffect extends Effect {
  constructor() {
    super("GravityLensEffect", fragment, {
      uniforms: new Map<string, Uniform>([
        ["uSphereNdc", new Uniform(new Vector2(0.5, 0.5))],
        ["uSphereRadius", new Uniform(0.18)],
        ["uLensStrength", new Uniform(0.18)],
        ["uRingWidth", new Uniform(0.012)],
        ["uRingIntensity", new Uniform(0.9)],
        ["uAspect", new Uniform(1.0)],
      ]),
    });
  }
}
