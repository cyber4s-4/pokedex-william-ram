import Pokemon from '../utils/pokemon';
import { htmlToElement } from '../utils/templateBuilder';
import IComponent from './IComponent';
/**
 * The extended information of a pokemon.
 */
export default class PokemonComponent implements IComponent {
  parentElement: HTMLElement;
  pokemonData: Pokemon;
  template: string;
  constructor(parentElement: HTMLElement, pokemonData: Pokemon) {
    this.parentElement = parentElement;
    this.pokemonData = pokemonData;
    this.template = `<div class="pokemon-info" id="{id}">
    <div class="pokemon-img-container">
      <img src="{pokemon-img}" class="pokemon-img" alt="Pokemon image">
    </div>
    <div class="inner-text-container">
      <h3 style="border-bottom: 1px solid black;">{name}</h3>
      <div id="general-info-container">
        <div>
          <strong> Name: </strong> {name}
        </div>
        <div>
          <strong> height: </strong> {height}
        </div>
        <div>
          <strong> weight: </strong> {weight}
        </div>
      </div>
      <div id="abilities-container">
        <div>
          <strong> abilities: </strong>
        </div>
        {abilityComponent}
      </div>
      <div id="stats-container">
        <div>
          <strong> stats: </strong>
        </div>
        {statsComponent}
      </div>
    </div>
  </div>`;
  }

  render(): void {
    let finalTemplate = this.template;
    finalTemplate = finalTemplate.replace('{pokemon-img}', this.pokemonData.largeImg!);
    finalTemplate = finalTemplate.replace('{name}', this.pokemonData.basicInfo.name);
    finalTemplate = finalTemplate.replace('{name}', this.pokemonData.basicInfo.name);
    finalTemplate = finalTemplate.replace('{height}', this.pokemonData.height!);
    finalTemplate = finalTemplate.replace('{weight}', this.pokemonData.weight!);
    finalTemplate = finalTemplate.replace('{abilityComponent}', this.createAbilitiesString());
    finalTemplate = finalTemplate.replace('{statsComponent}', this.createStatsString());
    const element = htmlToElement(finalTemplate);
    this.parentElement.appendChild(element);
  }

  private createAbilitiesString(): string {
    const statsTemplate = `
    <div> 
      {name}
    </div>`;
    let finalTemplate = '';
    for (const ability of this.pokemonData.abilities!) {
      finalTemplate = finalTemplate.concat(statsTemplate + '\n');
      finalTemplate = finalTemplate.replace(`{name}`, ability);
    }
    return finalTemplate;
  }

  private createStatsString(): string {
    const statsTemplate = `
    <div> 
      {name}: {baseStat}
    </div>`;
    let finalTemplate = '';
    for (const stat of this.pokemonData.stats!) {
      finalTemplate = finalTemplate.concat(statsTemplate + '\n');
      finalTemplate = finalTemplate.replace(`{name}`, stat.name);
      finalTemplate = finalTemplate.replace(`{baseStat}`, stat.baseStat.toString());
    }
    return finalTemplate;
  }

  update(data: Pokemon): void {
    this.pokemonData = data;
  }
}
