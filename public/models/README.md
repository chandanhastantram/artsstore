# Place your 3D models here

## Supported Formats

- `.glb` (recommended)
- `.gltf`

## File Naming

Use descriptive names:

- `bangle-gold-kundan.glb`
- `bangle-silver-traditional.glb`
- `necklace-pearl.glb`

## Usage

Reference models in your code as:

```
/models/your-model-name.glb
```

## File Size

Keep models under 5MB for fast loading.

## Example

```typescript
<ARViewer
  productName="Gold Bangle"
  modelUrl="/models/bangle-gold-kundan.glb"
  onClose={() => setShowAR(false)}
/>
```
