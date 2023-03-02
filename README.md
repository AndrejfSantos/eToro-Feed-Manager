# eToro-Feed-Manager
A browser extention to enable more control of the eToro feed.

The user can manage a blacklist of users, a blacklist of assets and other options in order to control what he sees in the eToro feed. 

Permission justification

scripting

This plugin requests scripting permission to be able to run the script that manages the feed using the options provided by the user.

storage

This plugin requests storage permission to persistently store the options of the user, this information remains on the user's machine and isn't shared

contextMenus

This plugin requests contextMenus permission to add the button "Block Person/Asset" to 2 pages , "*://*.etoro.com/home*" and "*://*.etoro.com/people*"

host_permissions

This plugin requests Host permissions for the url "*://*.etoro.com/home*" , that is the only page where the plugin will run its script code
    
