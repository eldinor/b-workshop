# Roombox Rework Plan

## Goal

Rework the existing workshop into a self-contained, open-front roombox.

The scene will retain most existing models while replacing the current room shell, lighting, layout, and scene organization. There will be no doors, corridor, or implied continuation beyond the room.

## Creative Direction

The result should feel like a carefully composed interactive workshop diorama rather than a complete building.

- Open front for an unobstructed three-quarter view.
- Back wall and two side walls built from boxes with visible thickness.
- Floor built as a shallow box rather than an infinite-looking plane.
- Open top with no ceiling, beams, or upper frame.
- A strong focal area around the main workbench.
- Secondary domestic and storage clusters using the existing props.
- A restrained industrial atmosphere established by low environment light and one warm workbench spotlight.

## Proposed Dimensions

Keep all dimensions in one configuration object so the shell, camera, lighting, and prop layout share the same coordinate system.

```ts
export const ROOMBOX = {
  width: 12,
  depth: 8,
  height: 4,
  wallThickness: 0.18,
  floorThickness: 0.2,
  origin: new Vector3(-5, 0, 0),
};
```

The final values can be adjusted after the retained models are placed in a test shell.

## Room Shell

Replace the current plane-based `Ground` implementation with a dedicated roombox builder.

Create:

1. A shallow floor box.
2. A back-wall box.
3. Left- and right-wall boxes.
4. Optional wall trim or a darker lower-wall band.

Do not create:

- A front wall.
- Doors or door openings.
- A corridor.
- A ceiling, beams, or upper frame.

Box geometry will provide convincing edges, thickness, shadows, and better corner joins. All shell meshes should be non-pickable and receive shadows where appropriate.

## Materials

Use a small, consistent material palette:

- Floor: worn tile, concrete, or a restrained combination of both.
- Main wall surface: dark or brown concrete.
- Accent areas: exposed brick used sparingly.
- Lower-wall band and trim: darker, rougher concrete or painted metal.

Improve the material helper:

- Rename texture fields to match their actual purpose.
- Configure ORM texture channels explicitly.
- Avoid treating roughness textures as generic metallic maps.
- Pass the `Scene` explicitly when creating materials and textures.
- Centralize texture scale, roughness, normal strength, and parallax settings.
- Reuse materials instead of creating duplicates for matching surfaces.

## Prop Composition

Retain most models, but organize them into readable groups rather than distributing them evenly around the room.

### Primary focal group

- Main workbench.
- Tools, first-aid kit, detector, hard drive, book, and small equipment.
- Strongest practical light in the scene.

### Domestic corner

- Armchair or old chair.
- Wooden table.
- Radio, kettle, dish, books, and ottoman.
- Lit only by the shared environment light and any spill from the workbench spotlight.

### Industrial storage group

- Fridges, gas cylinders, pallet, bins, crates, bucket, and broom.
- Kept visually quieter than the focal group through placement and material contrast.
- Some vertical stacking to improve the silhouette.

### Wall-mounted details

- Pipeshelf.
- Clock.
- Vent.
- Wall light.
- Light switch.
- Selected tools or electrical props.

Leave deliberate negative space between these groups. Preserve a readable floor area and avoid placing every retained model at equal visual importance.

## Lighting

Keep the lighting intentionally minimal.

### Base lighting

- Low-intensity neutral environment light.
- Enough fill to preserve model detail without flattening shadows.

### Key light

- Warm spotlight above the main workbench.
- Narrow enough to establish a clear focal area.
- Shadow casting enabled for important nearby props.

### Practical meshes

- Match emissive lamp materials to their corresponding real lights.
- Only the workbench fixture should appear actively illuminated.
- Use restrained bloom and avoid making unrelated models glow.

Remove the corridor lights and the current high-intensity, overlapping light setup. Do not add fill lights, rim lights, decorative lights, or additional practical lights at this stage.

## Post-processing

- Keep FXAA or MSAA at a sensible performance level.
- Use ACES tone mapping.
- Tune exposure after the new lights are established.
- Add subtle ambient occlusion if performance allows.
- If bloom is retained, apply it mildly to the workbench fixture only.
- Avoid heavy blur, color effects, or haze that obscures the diorama presentation.

## Camera and Presentation

- Make the default camera a controlled three-quarter roombox view.
- Constrain radius, beta, and target so the camera cannot move behind the walls or below the floor.
- Set the target near the workbench instead of the geometric origin.
- Keep limited orbit and zoom for inspection.
- Re-evaluate whether the first-person camera supports the open-front roombox concept; remove it if it adds little value.
- Add one or two optional preset views for the workbench and full composition.

## Code Structure

Break scene construction into focused modules:

```text
src/playground/
  scene/
    createWorkshopScene.ts
    roomboxConfig.ts
    createRoombox.ts
    createLighting.ts
    createPostProcessing.ts
  assets/
    modelCatalog.ts
    loadModels.ts
    workshopLayout.ts
  interaction/
    interactionController.ts
    actionRegistry.ts
  camera/
    cameraController.ts
  audio/
    audioController.ts
  ui/
    inspectionPanel.ts
```

The exact filenames can remain flexible, but `MainScene` should become an orchestrator rather than owning every subsystem.

## Data and Loading Improvements

- Keep model definitions declarative.
- Separate asset identity from placement data.
- Give model metadata and actions explicit TypeScript types.
- Load independent assets concurrently with controlled progress reporting.
- Handle missing meshes and failed asset loads without non-null assertions.
- Use stable asset IDs instead of behavior based on display names.
- Keep development-only inspector code out of the production bundle.
- Dispose observers, event listeners, sounds, and post-processes cleanly.

## Interaction Cleanup

- Replace keyboard counters with boolean state or a small action registry.
- Keep picking logic separate from UI rendering.
- Throttle pointer picking if GPU picking remains in use.
- Preserve useful interactions such as light switching and radios.
- Remove experimental shortcuts that are not part of the final roombox experience.
- Show concise, consistent prompts through one UI controller.

## Implementation Phases

### Phase 1: Establish the shell

- Add the shared roombox configuration.
- Build the floor and three walls from boxes.
- Remove the old wall planes, door-dependent geometry, and corridor creation.
- Set a temporary neutral material and verify dimensions with the current props.

### Phase 2: Compose the retained models

- Inventory models as keep, optional, or remove.
- Place the workbench focal group first.
- Compose the domestic and industrial groups.
- Add wall-mounted details last.
- Check the composition from the default camera throughout this phase.

### Phase 3: Rebuild materials and lighting

- Correct the PBR material helper and texture channel usage.
- Apply the final shell material palette.
- Add low-intensity environment light and one warm workbench spotlight.
- Configure shadows, emissive practicals, glow, exposure, and tone mapping.

### Phase 4: Refactor scene systems

- Extract asset loading and placement from `MainScene`.
- Extract camera, interaction, audio, and UI responsibilities.
- Remove obsolete corridor, door, camera, and experimental effect code.
- Add cleanup methods and stronger types.

### Phase 5: Polish and optimize

- Tune camera constraints and preset views.
- Improve loading feedback and interaction prompts.
- Profile draw calls, active lights, shadows, texture memory, and bundle size.
- Verify desktop resizing and representative lower-performance hardware.

## Acceptance Criteria

- The scene reads clearly as an open-front roombox.
- No doors, corridor, or exterior continuation remains.
- The floor and walls use box geometry with convincing thickness.
- Most existing models are retained but arranged into intentional groups.
- The workbench is the clear focal point.
- Lighting consists only of low-intensity environment illumination and one warm spotlight above the workbench.
- Materials respond correctly under PBR lighting.
- The camera stays within useful roombox viewing angles.
- `MainScene` no longer contains room construction, model loading, UI, audio, and interaction implementation in one class.
- The production build succeeds without introducing new TypeScript errors.

## First Implementation Slice

Start with the smallest visually meaningful change:

1. Create `roomboxConfig.ts`.
2. Replace `Ground` with `createRoombox.ts` using four box meshes: floor, back, left, and right.
3. Remove the corridor call and corridor-only geometry/lights.
4. Set a constrained three-quarter camera view.
5. Load the current props unchanged to evaluate scale and composition.

This establishes the new spatial foundation before time is spent tuning materials, lights, or individual model positions.
