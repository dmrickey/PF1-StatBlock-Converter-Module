import { sbcConfig } from "./sbcConfig.js"
import { sbcData, sbcError, sbcErrorLevels } from "./sbcData.js"
import { sbcMapping } from "./sbcParsers.js"

export class sbcUtils {
    static openingBrackets = ['(', '[', '{'];
    static closingBrackers = [')', ']', '}'];
    static matchingClosingBrackets = {'(': ')', '[' : ']', '{': '}'};

    static async createTempActor () {

        let tempActor = Actor.create({
            name: "sbc | Actor Template",
            type: sbcConfig.const.actorType[sbcData.actorType],
            folder: sbcData.customFolderId
        }, {temporary: true} )

        return tempActor
    }

    /* ------------------------------------ */
    /* Resetting and Updating   			*/
    /* ------------------------------------ */

    static resetData () {
        sbcData.errors = []
        sbcData.input = ""
        sbcData.preparedInput = {}
        sbcData.parsedInput = {}
        sbcData.characterData = {}
        sbcData.notes = {}
        this.resetCategoryCounter()
    }

    static resetCategoryCounter () {
        sbcData.foundCategories = 0
        sbcData.parsedCategories = 1
    }

    static resetCharacterData () {

        sbcData.characterData.items = []
        sbcData.characterData.spells = []
        sbcData.characterData.abilityDescriptions = []
        sbcData.characterData.characterDescriptions = []
        sbcData.characterData.conversionValidation.context = {}
        sbcData.characterData.conversionValidation.attributes = {}
        sbcData.characterData.conversionValidation.skills = {}

        this.resetCategoryCounter()
        this.resetTraits()
        this.resetTokenData()
        
    }

    static resetTraits() {
        // Reset traits
        sbcData.characterData.actorData.data.data.traits.cres = ""
        sbcData.characterData.actorData.data.data.traits.eres = ""
        sbcData.characterData.actorData.data.data.traits.senses = ""
        sbcData.characterData.actorData.data.data.traits.size = ""
        sbcData.characterData.actorData.data.data.traits.stature = ""
        sbcData.characterData.actorData.data.data.traits.dr = ""
        sbcData.characterData.actorData.data.data.traits.regen = ""
        sbcData.characterData.actorData.data.data.traits.fastHealing = ""
        sbcData.characterData.actorData.data.data.traits.ci.custom = ""
        sbcData.characterData.actorData.data.data.traits.ci.value = []
        sbcData.characterData.actorData.data.data.traits.di.custom = ""
        sbcData.characterData.actorData.data.data.traits.di.value = []
        sbcData.characterData.actorData.data.data.traits.dv.custom = ""
        sbcData.characterData.actorData.data.data.traits.dv.value = []
        sbcData.characterData.actorData.data.data.traits.languages.custom = ""
        sbcData.characterData.actorData.data.data.traits.languages.value = []
    }

    static resetTokenData () {
        sbcData.characterData.actorData.data.token.displayName = sbcConfig.options.tokenSettings.displayName
        sbcData.characterData.actorData.data.token.vision = sbcConfig.options.tokenSettings.vision
        sbcData.characterData.actorData.data.token.disposition = sbcConfig.options.tokenSettings.disposition
        sbcData.characterData.actorData.data.token.displayBars = sbcConfig.options.tokenSettings.displayBars
        sbcData.characterData.actorData.data.token.bar1 = sbcConfig.options.tokenSettings.bar1
        sbcData.characterData.actorData.data.token.bar2 = sbcConfig.options.tokenSettings.bar2
        sbcData.characterData.actorData.data.token.brightSight = 0
    }

    static resetFlags () {
        sbcConfig.options.flags = {
            "noStr": false,
            "noDex": false,
            "noCon": false,
            "noInt": false,
            "noWis": false,
            "noCha": false,
            "isUndead": false
        }
    }

    static resetErrorLog () {
        sbcData.errors = []
        let errorArea = $(".sbcErrorContainer #sbcErrors")
        errorArea.html("")
        this.updateErrorArea()
    }

    static resetInput() {
        let inputArea = $(".sbcContainer #sbcInput")
        this.resetHighlights()
        inputArea.val(null)
        
    }

    static resetHighlights () {
        let highlights = $("#sbcHighlights")
        highlights.html("")
    }
    
    static resetPreview() {
        let previewArea = $(".sbcContainer #sbcPreview")
        previewArea.html("")
    }

    static resetNotes() {
        sbcData.notes = {}
    }

    static async updatePreview() {
        this.resetPreview()
        let previewArea = $(".sbcContainer #sbcPreview")
        let preview = await renderTemplate('modules/pf1-statblock-converter/templates/sbcPreview.hbs' , {data: sbcData.characterData.actorData.data, notes: sbcData.notes })
        previewArea.append(preview)
    }

    static updateErrorArea() {
        sbcUtils.logErrors()
    }

    static async updateActorType() {

        let actorTypeToggle = $(".actorTypeToggle")

        if (sbcData.actorType === 0) {
            sbcData.actorType = 1
            actorTypeToggle.addClass("createPC")
        } else {
            sbcData.actorType = 0;
            actorTypeToggle.removeClass("createPC")
        }
        
        sbcData.characterData.actorData.data.type = sbcConfig.const.actorType[sbcData.actorType]

    }

    /* ------------------------------------ */
    /* ProgressBar Related Stuff            */
    /* ------------------------------------ */

    /*
     * TOTAL = 1
     * "preparation" = 0.1
     * "parsing" = 0.6
     * "entityCreation" = 0.2
     * "checkFlags" =  0.05
     * "generateNotes" = 0.05
     */

    static async updateProgressBar (process = "", subProcess = "", total = 1, step = 1) {

        let widthPreparation = 0.10
        let widthParsing = 0.60
        let widthEntities = 0.20
        let widthFlags =  0.05
        let widthPreview = 0.05

        let progressBar = $( "#sbcProgressBar" )
        let progressBarValue = $( "#sbcProgressValue" )
        let increment = 100 / total

        let newWidth = 0
        let progressBarText = ""

        switch (process.toLowerCase()) {
            case "preparation":
                progressBar.removeClass("ready")
                newWidth = Math.floor( widthPreparation * increment * step )
                progressBarText = process + ": " + subProcess
                break
            case "parsing":
                newWidth = Math.floor( 100 * ( widthPreparation ) + widthParsing * increment * step )
                progressBarText = process + ": " + subProcess
                break
            case "entities":
                newWidth = Math.floor( 100 * ( widthParsing + widthPreparation ) + widthEntities * increment * step )
                progressBarText = subProcess
                break
            case "flags":
                newWidth = Math.floor( 100 * ( widthEntities + widthParsing + widthPreparation ) + widthFlags * increment * step )
                progressBarText = subProcess
                break
            case "preview":
                newWidth = Math.floor( 100 * ( widthFlags + widthEntities + widthParsing + widthPreparation ) + widthPreview * increment * step )
                progressBarText = subProcess
                break
            case "actor":
                newWidth = 100
                progressBarText = subProcess
                progressBar.addClass("ready")
            default:
                break
        }

        progressBar.css("width", newWidth + "%")
        progressBarValue.empty().append(progressBarText)
    }
        

    /* ------------------------------------ */
    /* Log to the console and errorArea     */
    /* ------------------------------------ */

    static log(message) {
        sbcConfig.options.debug && console.log("sbc-pf1 | " + message);
    }

    static logErrors() {

        if (sbcData.errors.length > 0) {

            let errorLines = []

            let errorArea = $(".sbcErrorContainer #sbcErrors")
            errorArea.empty()
            errorArea.append("There were " + sbcData.errors.length + " issue(s) parsing the provided statblock:<br/>")

            let lastText = ""
            let lastId = 0
            let duplicateErrors = 2

            this.log("> There were " + sbcData.errors.length + " issue(s) parsing the provided statblock:");
            
            // Loop over all errors and create error messages as well as highlight problematic areas in the input
            for(let i=0; i<sbcData.errors.length; i++) {

                let error = sbcData.errors[i]

                let id = "sbcError-" + i
                let level = sbcErrorLevels[error.level]
                let keyword = error.keyword
                let text = error.message
                let line = error.line
                let message = level
                if (error.level < 2) {
                    message += " >> " + keyword + " failed "
                }
                message += " >> " + text

                if (text == lastText) {

                    let duplicateErrorIndicator = $("#" + lastId)
                    duplicateErrorIndicator.text(duplicateErrors)

                    duplicateErrorIndicator.addClass("active")
                    duplicateErrors++

                } else {

                    // Create a new error message in the error area
                    lastId = id
                    lastText = text
                    let errorMessage = `<div draggable='false' class='sbcErrors ${id}'><span id='${id}' class='identicalErrorIndicator'>${duplicateErrors}</span>${message}</div>`
                    this.log("> " + text)
                    
                    errorArea.append(errorMessage)
                    duplicateErrors = 2

                    if (line !== -1) errorLines.push(line)
                    
                }
   
            }
            
            // Highlight the lines, in which an error occured
            if (sbcData.preparedInput.data) {
                let highlights = $("#sbcHighlights")
                let inputArea = $("#sbcInput")
                let highlightedText = this.applyHighlights(errorLines)

                inputArea.scrollTop(0)
                highlights.html(highlightedText)
            }

        }
        
    }

    /* ------------------------------------ */
    /* Compendiums and Entities             */
    /* ------------------------------------ */

    static async findEntityInCompendium(compendium, input, line = -1) {

        // Create an array for all compendiums to search through
        let searchableCompendiums = []

        // Push the default compendium given when calling findEntityInCompendium
        if (compendium !== null) {
            searchableCompendiums.push(compendium)
        }
        
        // If there are customCompendiums, given as a string in the module settings,
        // split them and add them to the searchableCompendiums
        let customCompendiums = []
        let customCompendiumSettings = game.settings.get(sbcConfig.modData.mod, "customCompendiums")

        if (customCompendiumSettings !== "") {
            customCompendiums = customCompendiumSettings.split(/[,;]/g)
            searchableCompendiums = searchableCompendiums.concat(customCompendiums)
        }
                
        let searchResult = {}
        let foundEntity = {}
        
        let searchOptions = {
            "packs" : searchableCompendiums
        }

        searchResult = await game.pf1.utils.findInCompendia(input.name, searchOptions)

        if (searchResult !== false) {
            let packName = searchResult.pack.metadata.package + "." + searchResult.pack.metadata.name

            let pack = await game.packs.get(packName)
            foundEntity = await pack.getDocument(searchResult.index._id)

        } else {
            foundEntity = null
        }

        // Return the searchResult, which either is the found entity or an empty object
        return foundEntity
        
    }

    static async generatePlaceholderEntity (input, line = -1) {
        // If the input is NOT found in any of the given compendiums, create a placeholder

        let entityData = {
            "name": input.name ? input.name : null,
            "type": input.type ? input.type : null,
            
            // Creature-related
            "creatureType": input.creatureType ? input.creatureType : null,
            "subTypes": input.subTypes ? input.subTypes : null,
            "img": input.img ? input.img : "systems/pf1/icons/skills/yellow_36.jpg",
            
            // Gear-related
            "subtext": input.subtext ? input.subtext : null,
            "currency": input.currency ? input.currency : null,
            "enhancement": input.enhancement ? input.enhancement : null,
            "mwk": input.mwk ? input.mwk : null,
            
            // Class-related
            "wizardClass": input.wizardClass ? input.wizardClass : null,
            "suffix": input.suffix ? input.suffix : null,
            "archetype": input.archetype ? input.archetype : null,
            "level": input.level ? input.level : null,

            // Ability-related
            "specialAbilityType": input.specialAbilityType ? input.specialAbilityType : null,
            "desc": input.desc ? input.desc : "sbc | Placeholder"

            // Spell-related
            // WIP
            
        }

        let entity = null

        switch (input.type) {
            case "container":
                entity = new Item({
                    "name": "Money Pouch: " + sbcUtils.capitalize(entityData.name),
                    "type": "container",
                    "data": {
                        "description": {
                            "value": "sbc | All currency carried was put into this container."
                        },
                        "currency": {
                            "pp": entityData.currency.pp,
                            "gp": entityData.currency.gp,
                            "sp": entityData.currency.sp,
                            "cp": entityData.currency.cp
                        }
                    },
                    "img": "systems/pf1/icons/items/inventory/pouch-sealed.jpg"
                })
                break
            case "feats":
                entity = new Item({
                    "name": sbcUtils.capitalize(entityData.name),
                    "type": "feat",
                    "data": {
                        "description": {
                            "value": "sbc | As " + entityData.name + " could not be found in any compendium, a placeholder was generated."
                        },
                        
                    },
                    "img": entityData.img
                })
                break
            case "race":
                entity = new Item({
                    "name": sbcUtils.capitalize(entityData.name),
                    "type": "race",
                    "data": {
                        "description": {
                            "value": "sbc | As no playable race was found a placeholder was generated."
                        },
                        "creatureType": entityData.creatureType,
                        "subTypes": entityData.subTypes
                    },
                    "img": entityData.img
                })
                break
            case "misc":
                entity = new Item({
                    "name": sbcUtils.capitalize(entityData.name),
                    "type": "feat",
                    "data": {
                        "description": {
                            "value": entityData.desc
                        },
                        "featType": "misc"
                    },
                    "img": entityData.img
                })
                break
            case "attack":
                entity = new Item({
                    "name": sbcUtils.capitalize(entityData.name),
                    "type": "attack",
                    "data": {
                        "description": {
                            "value": entityData.desc
                        },
                        "attackType": "misc"
                    },
                    "img": entityData.img
                })
                break
            case "classFeat":
            case "class-abilities":
                if (entityData.specialAbilityType !== null) {
                    entity = new Item({
                        "name": sbcUtils.capitalize(entityData.name),
                        "abilityType": sbcUtils.capitalize(CONFIG['PF1'].abilityTypes[entityData.specialAbilityType].long),
                        "abilityTypeShort": sbcUtils.capitalize(entityData.specialAbilityType),
                        "type": "feat",
                        "data": {
                            "abilityType": entityData.specialAbilityType,
                            "description": {
                                "value": entityData.desc
                            },
                            "featType": "classFeat"
                        },
                        "img": entityData.img
                    })
                } else {
                    entity = new Item({
                        "name": sbcUtils.capitalize(entityData.name),
                        "abilityType": "",
                        "abilityTypeShort": "",
                        "type": "feat",
                        "data": {
                            "abilityType": "",
                            "description": {
                                "value": entityData.desc
                            },
                            "featType": "classFeat"
                        },
                        "img": entityData.img
                    })
                }
                break
            case "domains":
            case "mysteries":
                entity = new Item({
                    "name": sbcUtils.capitalize(entityData.name),
                    "type": "feat",
                    "data": {
                        "description": {
                            "value": "sbc | As there is no dedicated field for " + entityData.type + ", this placeholder was created."
                        },
                        "featType": "classFeat"
                    },
                    "img": entityData.img
                })
                break
            default:
                entity = new Item({
                    "name": sbcUtils.capitalize(entityData.name),
                    "type": entityData.type,
                    "data": {
                        "description": {
                            "value": "sbc | As " + entityData.name + " could not be found in any compendium, a placeholder was generated."
                        }
                    },
                    "img": entityData.img
                })
                break
        }

        return entity
    }

    /* ------------------------------------ */
    /* Conversion Validation                */
    /* ------------------------------------ */

    static async conversionValidation(actorID) {
        sbcConfig.options.debug && console.groupCollapsed("sbc-pf1 | Conversion Validation")

        try {

            const actor = await game.actors.get(actorID)

            const conversionValidation = sbcData.characterData.conversionValidation

            let changes = []
            let contextNotes = []

            let valueInAcTypes = 0

            // Validate the spellBooks
            let spellBooksToValidate = Object.keys(conversionValidation.spellBooks)
            for (let i=0; i<spellBooksToValidate.length; i++) {
                let spellBookToValidate = spellBooksToValidate[i]
                let casterLevelToValidate = conversionValidation.spellBooks[spellBookToValidate].casterLevel
                let concentrationBonusToValidate = conversionValidation.spellBooks[spellBookToValidate].concentrationBonus
                let casterLevelInActor = actor.data.data.attributes.spells.spellbooks[spellBookToValidate].cl.total

                let spellCastingAbility = actor.data.data.attributes.spells.spellbooks[spellBookToValidate].ability
                let spellCastingAbilityModifier = actor.data.data.abilities[spellCastingAbility].mod

                let differenceInCasterLevel = +casterLevelToValidate - +casterLevelInActor
                let differenceInConcentrationBonus = +concentrationBonusToValidate - +casterLevelToValidate + +spellCastingAbilityModifier

                if (differenceInCasterLevel !== 0) {
                    await actor.update({
                        "data": {
                            "attributes": {
                                "spells": {
                                    "spellbooks": {
                                        [spellBookToValidate]: {
                                            "cl": {
                                                "formula": differenceInCasterLevel.toString()
                                            },
                                            "concentrationFormula": differenceInConcentrationBonus.toString()
                                        }
                                    }
                                }
                            }
                        }
                    })
                }

            }

            // Get an array of all attributes that need to be validated
            let attributesToValidate = Object.keys(conversionValidation.attributes)
            
            // And push "acNormal", "acTouch" and "acFlatFooted" to the end of that array so it gets validated after the acTypes
            attributesToValidate.splice(attributesToValidate.indexOf("acNormal"),1)
            attributesToValidate.splice(attributesToValidate.indexOf("acTouch"),1)
            attributesToValidate.splice(attributesToValidate.indexOf("acFlatFooted"),1)
            attributesToValidate.push("acNormal", "acTouch", "acFlatFooted")

            // Get an array of all items the actor currently owns
            let currentItems = await actor.data.items
     
            //let currentItemsKeys = Object.keys(currentItems)
            let currentItemsKeys = currentItems//.keys()

            // Loop through the attributes ...
            for (let i=0; i<attributesToValidate.length; i++) {
                let attribute = attributesToValidate[i]
                let modifier = ""
                let target = ""
                let subTarget = ""
                let totalInStatblock = conversionValidation.attributes[attribute]
                let totalInActor = 0
                let valueInItems = 0
                let difference = 0

                // (1) ... and loop through the current items looking for relevant changes
                for (let i=0; i<currentItemsKeys.length; i++) {
                    
                    let currentItemKey = currentItemsKeys[i]
                    let currentItem = currentItems[currentItemKey]
                    let currentItemChanges = currentItem.data.changes

                    // Check, if the currentItem has changes to be considered
                    if (Array.isArray(currentItemChanges) && currentItemChanges.length) {
                        
                        let currentItemChange = currentItemChanges.find( function (element) {

                            if(element.subTarget === attribute.toLowerCase()) {
                                return element
                            }
                        })

                        // If the item had changes relevant to the current attribute,
                        // add these to valueInItems
                        if (currentItemChange !== undefined) {
                            valueInItems += +currentItemChange.formula                            
                        }

                    }

                }

                // Generate Changes for the conversionBuff
                switch (attribute.toLowerCase()) {
                    case "str":
                    case "dex":
                    case "con":
                    case "int":
                    case "wis":
                    case "cha":
                        totalInActor = actor.data.data.abilities[attribute.toLowerCase()].total
                        if (totalInActor !== totalInStatblock) {
                            difference = +totalInStatblock - +totalInActor
                        }
                        modifier = "untypedPerm"
                        target = "ability"
                        subTarget = attribute.toLowerCase()
                        break
                    case "cmd":
                    case "cmb":
                    case "init":
                        totalInActor = actor.data.data.attributes[attribute].total
                        modifier = "untypedPerm"
                        target = "misc"
                        subTarget = attribute
                        if (totalInActor !== totalInStatblock) {
                            difference = +totalInStatblock - +totalInActor
                        }
                        break
                    case "hpbonus":
                        modifier = "untypedPerm"
                        target = "misc"
                        subTarget = "mhp"
                        difference = +totalInStatblock
                        break
                    case "hptotal":
                        totalInActor = actor.data.data.attributes.hp.max

                        modifier = "untypedPerm"
                        target = "misc"
                        subTarget = "mhp"
                        
                        difference = +totalInStatblock - +totalInActor

                        await actor.update({
                            "data": {
                                "attributes": {
                                    "hp": {
                                        "value": +actor.data.data.attributes.hp.value - +difference
                                    }
                                }
                            }
                        })
                        
                        break
                    case "acnormal":
                        totalInActor = actor.data.data.attributes.ac.normal.total
                        modifier = "untypedPerm"
                        target = "ac"
                        subTarget = "aac"
                        difference = +totalInStatblock - +totalInActor - +valueInAcTypes
                        break
                    case "base":
                    case "enhancement":
                    case "dodge":
                    case "inherent":
                    case "deflection":
                    case "morale":
                    case "luck":
                    case "sacred":
                    case "insight":
                    case "resistance":
                    case "profane":
                    case "trait":
                    case "racial":
                    case "competence":
                    case "circumstance":
                    case "alchemical":
                    case "penalty":
                        modifier = attribute
                        target = "ac"
                        subTarget = "ac"
                        difference = +totalInStatblock - +valueInItems
                        valueInAcTypes += +totalInStatblock
                        break
                    case "rage":
                        modifier = "untypedPerm"
                        target = "ac"
                        subTarget = "ac"
                        difference = +totalInStatblock
                        break
                    case "fort":
                    case "ref":
                    case "will":
                        modifier = "untypedPerm"
                        target = "savingThrows"
                        subTarget = attribute
                        totalInActor = actor.data.data.attributes.savingThrows[attribute].total
                        difference = +totalInStatblock - +totalInActor
                        break
                    default:
                        break
                }

                // If the total in the statblock differs from the total in foundry, add a change to the conversion buff
                if (difference !== 0) {

                    let attributeChange = {
                        "formula": difference.toString(),
                        "modifier": modifier,
                        "operator": "add",
                        "priority": 0,
                        "subTarget": subTarget,
                        "target": target,
                        "value": +difference,
                        "id": randomID(8)
                    }

                    changes.push(attributeChange)
                }

            }

            // Add context notes to the buff
            let contextNotesToAdd = Object.keys(conversionValidation.context)

            for (let i=0; i<contextNotesToAdd.length; i++) {
                let contextNoteType = contextNotesToAdd[i]
                let contextNoteToAdd = conversionValidation.context[contextNoteType]

                if (contextNoteToAdd !== "") {
                    let contextNote = {
                        "subTarget": contextNoteType,
                        "target": "misc",
                        "text": contextNoteToAdd
                    }
                    contextNotes.push(contextNote)
                }

            }

            // Handle Skill Information in the conversionValidation
            // (1) Create skillContext Objects to add to the Buff
            // (2) Adjust for differences between calculated skillTotals and statblockTotals
            let skillKeys = Object.keys(conversionValidation.skills)

            for (let i=0; i<skillKeys.length; i++) {

                let skillKey = skillKeys[i]
                let parentSkillKey = skillKey.replace(/(\d+)/, "")
                let skillToValidate = conversionValidation.skills[skillKey]
                let skillModInActor = 0
                
                let skillSubKeys = Object.keys(actor.data.data.skills[parentSkillKey])

                // For Skills with subskill --> subTarget: "skill.prf.subSkills.prf1"
                let subTarget = ""

                if (!skillSubKeys.includes("subSkills")) {
                    skillModInActor = await actor.data.data.skills[skillKey].mod
                    subTarget = "skill." + skillKey
                } else {
                    skillModInActor = await actor.data.data.skills[parentSkillKey].subSkills[skillKey].mod
                    subTarget = "skill." + parentSkillKey + ".subSkills." + skillKey

                }

                // (1) Create skillContext Objects to add to the Buff
                if (skillToValidate.context !== "") {
                    let contextNote = skillToValidate.context
                    let skillContext = {
                        "subTarget": subTarget,
                        "target": "skill",
                        "text": contextNote
                    }
                    contextNotes.push(skillContext)
                }

                // (2) Adjust for differences between calculated skillTotals and statblockTotals
                if (+skillToValidate.total !== +skillModInActor) {
                    let difference = +skillToValidate.total - +skillModInActor
                    
                    if (difference !== 0) {
                        let skillChange = {
                            "formula": difference.toString(),
                            "modifier": "untypedPerm",
                            "operator": "add",
                            "priority": 0,
                            "subTarget": subTarget,
                            "target": "skill",
                            "value": +difference,
                            "id": randomID(8)
                        }
                        changes.push(skillChange)
                    }
                    
                }

            }

            // Create the conversionBuffItem as an embedded entity
            /*let conversionBuffItem = await Item.create({
                "name": "sbc | Conversion Buff",
                "type": "buff",
                "data": {
                    "description": {
                        "value": `<h2>sbc | Conversion Buff</h2>
                        This Buff was created by <strong>sbc</strong> to compensate for differences between the input and the values FoundryVTT calculates automatically.
                        <br><br>
                        Especially when the pathfinder system gets upgraded, entries in compendiums get updated or foundry changes in some way, this buff may become outdated.
                        <br><br>
                        For most mooks the conversion should more or less work, but for important NPCs or creatures it is adviced to double check the conversion manually.`
                    },
                    "active": true,
                    "buffType": "perm",
                    "changeFlags": {
                        "heavyArmorFullSpeed": false,
                        "loseDexToAC": false,
                        "mediumArmorFullSpeed": false,
                        "noDex": false,
                        "noEncumbrance": false,
                        "noStr": false,
                        "oneCha": false,
                        "oneInt": false,
                        "oneWis": false
                    },
                    "changes": changes,
                    "contextNotes": contextNotes,
                    "hideFromToken": true,
                    "level": 0,
                    "links": {children: Array(0)},
                    "tag": "sbcConversionBuff",
                    "tags": [],
                    "useCustomTag": true,
                    "uses": {value: 0, max: 0}
                },
                "img": "systems/pf1/icons/skills/yellow_36.jpg"
            }, { temporary : true })
            */

            let conversionBuffItem = new Item({
                "name": "sbc | Conversion Buff",
                "type": "buff",
                "data": {
                    "description": {
                        "value": `<h2>sbc | Conversion Buff</h2>
                        This Buff was created by <strong>sbc</strong> to compensate for differences between the input and the values FoundryVTT calculates automatically.
                        <br><br>
                        Especially when the pathfinder system gets upgraded, entries in compendiums get updated or foundry changes in some way, this buff may become outdated.
                        <br><br>
                        For most mooks the conversion should more or less work, but for important NPCs or creatures it is adviced to double check the conversion manually.`
                    },
                    "active": true,
                    "buffType": "perm",
                    "changeFlags": {
                        "heavyArmorFullSpeed": false,
                        "loseDexToAC": false,
                        "mediumArmorFullSpeed": false,
                        "noDex": false,
                        "noEncumbrance": false,
                        "noStr": false,
                        "oneCha": false,
                        "oneInt": false,
                        "oneWis": false
                    },
                    "changes": changes,
                    "contextNotes": contextNotes,
                    "hideFromToken": true,
                    "level": 0,
                    "links": {children: Array(0)},
                    "tag": "sbcConversionBuff",
                    "tags": [],
                    "useCustomTag": true,
                    "uses": {value: 0, max: 0}
                },
                "img": "systems/pf1/icons/skills/yellow_36.jpg"
            })

            await actor.createEmbeddedDocuments("Item", [conversionBuffItem.data.toObject(false)])
            
        } catch (err) {

            let errorMessage = "Failed to validate the conversion and create a conversion buff"
            let error = new sbcError(1, "Validation", errorMessage)
            sbcData.errors.push(error)
            throw err

        }

        sbcConfig.options.debug && console.groupEnd()

    }

    /* ------------------------------------ */
    /* Workers                              */
    /* ------------------------------------ */

    static sbcSplit(input) {
        // Split the input string at commas, excluding commas in parenthesis, and return an array of the items

        let items = []
        
        // Remove Commas in large Numbers, e.g. 3,000 GP --> 3000 GP
        let tempInput = input.replace(/(\d{1})(,)(\d{1})/g, "$1$3").trim()

        // Check if there are commas or semicolons
        if (tempInput.search(/,|;/g) !== -1) {

            // Check if there are parenthesis including commas in the input
            if (tempInput.match(/([^,;]+\([^(]+?(?:,|;)[^(.]+?\))+?/gi) !== null) {
                // Get the input with parenthesis and commas inside the parenthesis
                let itemsWithCommasInParenthesis = tempInput.match(/([^,;]+\([^(]+?(?:,|;)[^(.]+?\)[^,]*)+?/gi)
                let itemsWithCommasInParenthesisKeys = Object.keys(itemsWithCommasInParenthesis)
                
                for (let i=0; i<itemsWithCommasInParenthesisKeys.length; i++) {

                    let tempKey = itemsWithCommasInParenthesisKeys[i]
                    let tempItem = itemsWithCommasInParenthesis[tempKey].trim()

                    let patternTempItem = new RegExp (tempItem.replace(/\(/g,"\\(").replace(/\)/g,"\\)").replace(/\+/g,"\\+"), "i")

                    tempInput = tempInput.replace(patternTempItem, "").replace(/,\s*,/, ",").replace(/^,/, "").trim()

                    items.push(tempItem)

                }

                // Add any items without parenthesis back into the "items"-array
                let itemsWithoutParenthesis = []

                if (tempInput !== "") {
                    itemsWithoutParenthesis = tempInput.replace(/,\s*,/, ",").replace(/[;,]\s*$/, "").split(/[,;]/g)
                }
                
                if (itemsWithoutParenthesis.length > 0) {
                    //items = items.concat(...itemsWithoutParenthesis)
                    items = itemsWithoutParenthesis.concat(...items)
                }                

            } else {

                // If there are no parenthesis with commas, just split at commas/semi-colons
                items = tempInput.split(/[,;]/g)

            }

        } else {

            // When there is only one item, split at the first closing bracket and put it into the array
            items = tempInput.replace(/\)\s/, ");").split(/;/)

        }

        return items

    }

    // 
    static parseSubtext(value) {

        // Remove punctuation at the end of the input
        let input = value.replace(/(^[,;.: ]*|[,;.: ]+$)/g, "")

        let startSubtextIndex = input.indexOf('(')
        let endSubtextIndex = input.indexOf(')')

        if (startSubtextIndex > -1 && endSubtextIndex > startSubtextIndex) {
            let baseValue = input.substring(0, startSubtextIndex).trim()
            let subValue = input.substring(startSubtextIndex+1, endSubtextIndex).trim()
            let restValues = []
            
            // Check, if there is something left and parse that again
            if (endSubtextIndex+1 < input.length) {
                let rest = input.substring(endSubtextIndex+1).replace(/(^[,;.: ]*|[,;.: ]+$)/g, "").trim()
                restValues = this.parseSubtext(rest)
            }

            if (!Array.isArray(restValues) || !restValues.length) {
                return [baseValue, subValue]
            } else {
                return [baseValue, subValue, restValues]
            }
            
        } else {
            return [value]
        }
    }

    static getKeyByValue(object, value) { 
        return Object.keys(object).find(key => object[key].toLowerCase() === value.toLowerCase()); 
    } 

    static applyHighlights(errorLines) {

        let highlightedText = []

        for (let i=0; i<sbcData.preparedInput.data.length; i++) {  

            if (errorLines.includes(i)) {
                let highlightedLine = "<mark>" + sbcData.preparedInput.data[i] + "</mark><br>"
                highlightedText.push(highlightedLine)
            } else {
                //sbcData.preparedInput.data[i] !== "<br>" && highlightedText.push(sbcData.preparedInput.data[i] + "<br>")
                if (sbcData.preparedInput.data[i] !== "") {
                    highlightedText.push("<div class='lineNumbers'>" + sbcData.preparedInput.data[i] + "</div>")
                } else {
                    highlightedText.push("<div class='lineNumbers'><br></div>")
                }
            }

        }

        return highlightedText
      }

    static getModifier(attribute) {
        return Math.floor(((attribute-10)/2));
    }
    
    static getSumOfChangeModifiers(changePool) {
        let sumOfChanges = 0;
        let changeKeys = Object.keys(changePool)
        for (let i=0; i<changeKeys.length; i++) {
            sumOfChanges += changePool[changeKeys[i]];
        }
        return sumOfChanges;
    }
    
    static getEncumbrance (strength) {
        // If(Str <= 10) MaxCarryingCapacity = 10*Str
        // If(Str > 10) MaxCarryingCapacity = 5/4 * 2^Floor(Str/5)* Round[20 * 2^(Mod(Str,5)/5)]
        
        if(strength <= 10) {
            return strength*10;
        } else {
            return 5/4 * (2 ** Math.floor(strength/5)) * Math.round(20 * ( 2 ** ( (strength % 5) / 5 ) ) );
        }
    }
    
    static getDiceAverage (diceSize) {
        let sum = 0;
        for (let i=1; i<=diceSize; i++) {
            sum += i;
        }
            
        return sum/diceSize;
    }
    
    static makeValueRollable(string) {
            
        var output = string.replace(/(\d+d\d+)/g, "[[$1]]");
        
        return output;
    }
    
    // WIP:
    // MAYBE CHANGE THIS TO KEEP WORDS LIKE "of" LOWER CASE
    static capitalize (string) {
        return string.toLowerCase().replace(/^\w|\s\w/g, function (letter) {
            return letter.toUpperCase();
        })
    }

    static camelize(text) {
        if (!text) {
            return text
        }

        return text.replace(/^([A-Z])|[\s-_]+(\w)/g, function(match, p1, p2, offset) {
            if (p2) return p2.toUpperCase();
            return p1.toLowerCase();        
        });
    }

    static stringContains(string, subString, bCaseSensitive = true) {
        if (bCaseSensitive) {
            return string.includes(subString);
        }
        return string.toLowerCase().includes(subString.toLowerCase());
    }

    static stringStartsWith(string, searchString, bCaseSensitive = true) {
        if (!string) return false;
        if (!searchString) return false;

        try {
            if (searchString.length > string.length) {
                return false;
            }

            if (bCaseSensitive) {
                return string.startsWith(searchString);
            } else {
                let startPart = string.substring(0, searchString.length);
                return startPart.toLowerCase() === searchString.toLowerCase();
            }
        } catch (err) {
            sbcUtils.log(`stringStartsWith('${string}', '${searchString}', ${bCaseSensitive}) threw an error: ${err}`);
            throw err;
        }
    }

    static switchValue(obj){
        const ret = {};
        Object.keys(obj).forEach(key => {
            ret[obj[key]] = key;
        });
        return ret;
    }
}
