# Doing
- (Austin) refactor the beta page
- (Austin)(Easy) Switching frames turns on any layers that were switched to be hidden (only a problem for onion skin)
- (Austin)(Medium) Fill in for shapes
- (Austin) get color picker working again
    - lights / darks 
    - add opacity 
- (Nate) The zoom scroll zooms to the center, not the cursor

# TODO
- (Easy) Use the same icons set across the app
- (Easy) Join multiple similer tool into one iterface
- (Easy) switching tabs resets state
- (Easy) Saveable color palettes 
- (Easy) increase / decrease active frame in animation
- (Medium) light tool is to strong and doesint work on black
- (Medium) insert duplicated frame after the current frame
- (Medium) saved projects should have a preview img
- (Hard) make selections standout
- (Hard) Ctrl-z undos brush strokes and last canvas resize {urgent} (update: this glitch only happens when actually typing in the changes, and only works when the change makes the value more than the base 32)
    - CTRL-Z undos and changes in text (title, color palette name, ect)
    - When you undo layer joins, the number of layers does not change, the layer just disappears.
    - Undo redo wont work with layers
- (Hard) Add blur / jumble tool
- (Hard) Add contour tool 
- (Austin) add console error watch system

# Promotion
- discord channels
- google ads
- reddit
- itch game jam
- twitch channels
- product hunt

# Kickstarter Launch
- setup alpha / beta test branch
- moth subdomain or /moth
- user accounts
- login page
- payment page
- pricing page
- bugpack home page

# Pro Features
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
    - The "sun" effect is a ball, that is placed somewhere on the canvas, and affects the colors of the sprites with a specific falloff
        - light source tool, creates highlights and shadows for you 
- theme
    - retro game consoles
    - grid colors
    - custom layout, custom shortcut
    - minimize UI

# Stretch 
- Multiple sprite tabs
- Layer groups / frame groups
- add data file for export
- node based editor
- online gallery 
- tools
    - erase mirror
    - perfect mode for brush
    - custom brushes 
    - fonts
    - A spray brush
- selection areas
    - rotate and scale selection areas
    - duplicate selection 
    - move selection to new layer new layer 
- shortcuts 
    - custom shortcuts override default
    - reset shortcuts to default
    - hold shift to imitate mouse pressed (for trackpad users)
    - custom shortcuts 
- colors
    - Color pallets that are premade
    - Option to create a color pallet from sprite
    - previous 2 color switch
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










