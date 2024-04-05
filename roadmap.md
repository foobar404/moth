# Done
- 1.0.1 4/4/25
    - (Easy)(Feature) left right arrow for frames, up down arrow for layers
    - (Easy)(Bug) fill all tooltip
        - use cloud for icon 
        - discontinuous fill / global fill 
     - (Easy)(Bug) tool / action button color
     - (Easy)(Feature) fps slider
     - (Easy)(Feature) show preview of size when scaling export
     - (Easy)(Feature) eye icon on the left side
     - (Easy)(Bug) range sliders are hard to see

# Doing
- Austin
    - (Easy)(Feature) mirror from starting point
        - (Easy)(Feature) mirror ying / yang
    - (Easy)(Bug) current tool state breaking line tool
    - (Easy)(Feature) npm i react-beautiful-dnd
        - (Easy)(Feature) dnd tabs
      - (Easy)(Bug) obfuscate build code
- Nate

# TODO
- (Easy) FPS is reset when pressing space
- (Easy)(Feature) make app comply with PWA standards
    - (Easy)(Feature) install PWA prompt
- (Easy)(Feature) export format dropdown
- (Easy)(Feature) icon in the nav to toggle sections
- (Easy)(Feature) colored circle for eye dropper
- (Easy)(Bug) thickness for shapes
- (Easy)(Feature) flatten all layers
- (Easy)(Feature) play animation backwards?
- (Easy)(Feature) last frame / first frame
- (Easy)(Feature) ping / pong animation loop?
- (Easy)(Feature) import color palette from image or color palette file
- (Easy)(Feature) export as zip, file for each frame
- (Easy)(Feature) hide / show frame
    - (Easy)(Feature) buttons on frames, hide from animation
- (Easy)(Feature) rainbow color mode
- (Easy)(Feature) random color mode
- (Easy)(Feature) save color palette as .csv / load .csv
- (Easy)(Bug) shape icons are rounded
- (Easy)(Feature) move tool is like a selection tool
- (Easy)(Feature) indexed colors
- (Easy)(Feature) animate main canvas
- (Easy)(Feature) make clear more accessable
- (Easy)(Feature) only show popup when new version is available
- (Easy)(Feature) make frames & color/layers section collapsible
- (Easy)(Feature) update shortcut keys
- (Easy)(Bug) Switching frames turns on any layers that were switched to be hidden (only a problem for onion skin)
- (Easy)(Feature) Use the same icons set across the app
- (Easy)(Feature) Join multiple similer tool into one iterface
- (Medium)(Feature) copy / paste selection
- (Medium)(Feature) export as css
- (Medium)(Feature) onion skinning for furure frame
    - onion skinning color effects
- (Medium)(Feature) select by color
- (Medium)(Feature) select by drawing
- (Medium)(Feature) crop tool
- (Medium)(Feature) refrence images tab
- (Medium)(Feature) mirror mode
- (Medium)(Feature) add current mouse position
- (Medium)(Feature) import gif as frames
- (Medium)(Feature) fullscreen canvas mode
- (Medium)(Bug) pressing z is buggy
- (Medium)(Feature) Sprite packing
- (Medium)(Feature) Import and slice existing .png spritesheets.
- (Medium)(Feature) .pyxel and .asesprite / .ase import
- (Medium)(Feature) load demo button
- (Medium)(Feature) wrap around move option
- (Medium)(Feature) add spray tool
- (Medium)(Feature) The zoom scroll zooms to the center, not the cursor
- (Medium)(Feature) Layer groups / frame groups
- (Medium)(Bug) light tool is to strong and doesint work on black
- (Medium)(Bug) insert duplicated frame after the current frame
- (Medium)(Feature) add console error watch system
- (Medium)(Feature) Multiple sprite tabs
- (Medium)(Feature) add pixel perfect mode to line tool
- (Medium)(Feature) allow custom brush shapes 
- (Medium)(Bug) line tool wasint working (tool state)
- (Medium)(Bug) make new & duplicated frames go after current frame 
- (Hard)(Feature) Add blur / jumble tool
- (Hard)(Feature) Add contour tool 
    - (Medium)(Feature) fill brush tool (close loop)
- (Hard)(Feature) add font tool
- (Hard)(Bug) [ & ] tigger wrong shortcut
- (Hard)(Bug) shortcuts stop working after a while
- (Hard)(Feature) tools only modify active selection
- (Hard)(Feature) better selection box
- (Hard)(Feature) download as svg
- (Hard)(Feature) export as .tmx
- (Hard)(Feature) make selections standout
    - rotate
    - scale
    - draw only in selection
    - move to new layer / frame
- (Hard)(Feature) Ctrl-z undos brush strokes and last canvas resize
    - CTRL-Z undos and changes in text (title, color palette name, ect)
    - When you undo layer joins, the number of layers does not change, the layer just disappears.
    - Undo redo wont work with layers
- (Hard)(Feature) settings modal
    - custom shortcuts 
        - custom shortcuts override default
    - reset shortcuts to default button 
- (Hard)(Bug) get color picker working again
    - Color pallets that are premade
    - Option to create a color pallet from sprite
    - color pallette recommendations 
    - recommend colors based on current pallete and AI 
    - recommend better color alternatives based on AI 
    - pallette 
        - when changing color in pallete, update all instances of that color in all layers 
        - import/paste and export/copy a color pallette 
        - import pallette from image 
            - limit pallette to x colors
            - start with most common colors
            - squash similer colors?
    - deleting a color from the pallette doesint effect layers
    - lights / darks 
    - add opacity 

# Kickstarter Launch
- setup alpha / beta test branch
- moth subdomain or /moth
- user accounts
- login page
- payment page
- pricing page
- bugpack home page
- online gallery 

# Pro Features
- tilemap features (https://github.com/praghus/plextus)
- realtime collaboration
- 3d pixel editing
- node based editor (https://github.com/Ttanasart-pt/Pixel-Composer)
- rig system 
    - mesh deformation tool (points, weights)
    - bones arnt visible in final render
    - one bone per layer
    - pivit point for the layer becomes the start of the bone
    - choose parent bone when creating new bone
    - copy and paste layer copies bones aswell
    - when animating bones, use index of bone to figure out which bones should move
    - parent bones move child bones on other layers
- tweening
    - generate tweening frame via AI
    - choose how many frames to create
    - button to generate tweening frames based on "move" tool or "bone" tool
    - provide types of progression arcs
- ai sprite gen
- non-destructive "Effects"
    - color filter
    - outline effect
    - texture fill
    - The "sun" effect is a ball, that is placed somewhere on the canvas, and affects the colors of the sprites with a specific falloff
        - light source tool, creates highlights and shadows for you 
- themes
    - retro game consoles
    - grid colors
    - custom layout, custom shortcut
    - minimize UI

# Promotion Ideas
- reddit
- itch game jam
- twitch channels
- build catapiller extension

# Best editors on the market
aseprite - https://www.aseprite.org/
piskel - https://www.piskelapp.com/
pixelorama - https://orama-interactive.itch.io/pixelorama
spritepaint - https://spritepaint.com/
pixelmash - https://nevercenter.com/pixelmash/
pixel composer - https://makham.itch.io/pixel-composer
wunderpaint - https://lean8086.github.io/wunderpaint/
