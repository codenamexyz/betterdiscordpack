/**
 * @name UnlockStreamQuality
 */
module.exports = class OTRClass {
    originalRequirements = [];
    originalBoostedGuildFeatures = [];
    //cancelFileSizePatch = ()=>{};
    getName() { return "Stream Settings Unlocked"; };
    getDescription() { return "This will unlock stream settings removing their requirments."; };
    getVersion() { return "0.0.1"; };
    getAuthor() { return "andandy12"; };
 
    start() {
        BdApi.showToast("Stream Settings Unlocked is starting");
        console.log("\n[Stream Settings Unlocked] Starting");
 
        //deletes userPremiumType and guildPremiumTier from the requirments array.
        this.originalRequirements = BdApi.findModuleByProps("ApplicationStreamPresets").ApplicationStreamSettingRequirements;
        for(let i =0; i<BdApi.findModuleByProps("ApplicationStreamPresets").ApplicationStreamSettingRequirements.length;i++){
            delete BdApi.findModuleByProps("ApplicationStreamPresets").ApplicationStreamSettingRequirements[i].userPremiumType;
            delete BdApi.findModuleByProps("ApplicationStreamPresets").ApplicationStreamSettingRequirements[i].guildPremiumTier;
        }
        
        // (sometimes when in bulk) allows you to upload more emojis than allowed... they cant be used until you have the proper level
        let a = BdApi.findModuleByProps("AppliedGuildBoostsRequiredForBoostedGuildTier").BoostedGuildFeatures[3];
        this.originalBoostedGuildFeatures = BdApi.findModuleByProps("AppliedGuildBoostsRequiredForBoostedGuildTier").BoostedGuildFeatures;
        let temp = [];
        temp[0] = a;
        temp[1] = a;
        temp[2] = a;
        temp[3] = a;
        BdApi.findModuleByProps("AppliedGuildBoostsRequiredForBoostedGuildTier").BoostedGuildFeatures = temp;
 
        /*// patches getUserMaxFileSize so it returns 10gb
        this.cancelFileSizePatch = BdApi.monkeyPatch(BdApi.findModuleByProps("getUserMaxFileSize"), "getUserMaxFileSize", {
            instead: (e) => {
                return 85899345920;
            }
        })*/ // this does not work
    }
 
    stop() {
        BdApi.findModuleByProps("ApplicationStreamPresets").ApplicationStreamSettingRequirements = this.originalRequirements;
        //this.cancelFileSizePatch();
        BdApi.findModuleByProps("AppliedGuildBoostsRequiredForBoostedGuildTier").BoostedGuildFeatures = this.originalBoostedGuildFeatures;
        console.log("[Stream Settings Unlocked] Stopped");
        BdApi.showToast("[Stream Settings Unlocked] Stopped");
    }
}