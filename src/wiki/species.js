import { global } from './../vars.js';
import { loc } from './../locale.js';
import { clearElement } from './../functions.js';
import { races, traits, genus_traits } from './../races.js';
import { popover } from './functions.js';

export function racesPage(){
    let content = $(`#content`);
    clearElement(content);

    Object.keys(races).forEach(function (race){
        if ((race === 'custom' && !global.hasOwnProperty('custom')) || race === 'protoplasm'){
            return;
        }

        let info = $(`<div class="infoBox"></div>`);
        content.append(info);

        info.append(`<div class="type"><h2 class="has-text-warning">${races[race].name}</h2><span class="has-text-caution">${loc(`genelab_genus_${races[race].type}`)}</span></div>`);
        info.append(`<div class="desc">${races[race].desc}</div>`);

        let traitList = [];

        let genes = $(`<div class="itemlist"></div>`);
        Object.keys(genus_traits[races[race].type]).sort().forEach(function (trait){
            let id = `raceTrait${race}${trait}`;
            let color = races[race].fanaticism === trait ? 'danger' : 'caution';
            genes.append(`<span class="has-text-${color}" id="${id}">${traits[trait].name}<span>`);
            traitList.push(trait);
        });
        Object.keys(races[race].traits).sort().forEach(function (trait){
            let id = `raceTrait${race}${trait}`;
            let color = races[race].fanaticism === trait ? 'danger' : 'info';
            genes.append(`<span class="has-text-${color}" id="${id}">${traits[trait].name}<span>`);
            traitList.push(trait);
        });
        info.append(genes);

        for (let i=0; i<traitList.length; i++){
            let id = `raceTrait${race}${traitList[i]}`;
            let desc = $(`<div></div>`);
            traitDesc(desc,traitList[i],traitList[i] === races[race].fanaticism ? races[race].name : false);
            popover(id,desc);
        }
    });
}

export function traitsPage(){
    let content = $(`#content`);
    clearElement(content);

    let types = ['genus','major','minor','special'];
    for (let i=0; i<types.length; i++){
        Object.keys(traits).sort().forEach(function (trait){
            if (traits[trait].type === types[i]){
                let info = $(`<div class="infoBox"></div>`);
                content.append(info);
                traitDesc(info,trait);
            }
        });
    }
}

export function traitDesc(info,trait,fanatic){
    info.append(`<h2 class="has-text-warning">${traits[trait].name}</h2>`);
    info.append(`<div class="type has-text-caution">${loc(`wiki_trait_${traits[trait].type}`)}</div>`);
    if (fanatic){
        info.append(`<div class="has-text-danger">${loc(`wiki_trait_fanaticism`,[fanatic])}</div>`);
    }
    info.append(`<div class="desc">${traits[trait].desc}</div>`);

    // Many of the strings need to be filled in with descriptions, work in progress
    let vals = traits[trait].hasOwnProperty('vars') ? traits[trait].vars : [];
    let color = 'warning';
    if (traits[trait].hasOwnProperty('val')){
        color = traits[trait].val >= 0 ? 'success' : 'danger';
    }
    info.append(`<div class="has-text-${color} effect">${loc(`wiki_trait_effect_${trait}`,vals)}</div>`);
}