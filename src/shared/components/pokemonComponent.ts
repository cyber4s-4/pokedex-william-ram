import Pokemon from '../utils/pokemon';
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
    finalTemplate = finalTemplate.replace('{pokemon-img}', this.pokemonData.basicInfo.img);
    finalTemplate = finalTemplate.replace('{name}', this.pokemonData.basicInfo.name);
    finalTemplate = finalTemplate.replace('{name}', this.pokemonData.basicInfo.name);
    finalTemplate = finalTemplate.replace('{height}', this.pokemonData.height!);
    finalTemplate = finalTemplate.replace('{weight}', this.pokemonData.weight!);
    finalTemplate = finalTemplate.replace('{abilityComponent}', this.createAbilitiesString());
    finalTemplate = finalTemplate.replace('{statComponent}', this.createStatsString());

  }

  private createAbilitiesString(): string {
    const statsTemplate = `
    <div> 
      {name}:
    </div>
    <div> 
      {effect}
    </div>`;
    let finalTemplate = statsTemplate;
    for (const ability of this.pokemonData.abilities!) {
      finalTemplate = finalTemplate.replace(`{name}`, ability.name);
      finalTemplate = finalTemplate.replace(`{effect}`, ability.effect);
      finalTemplate = finalTemplate.concat(this.template + '\n');
    }
    return statsTemplate;
  }

  private createStatsString(): string {
    const statsTemplate = `
    <div> 
      {name}: {baseStat}
    </div>`;
    let finalTemplate = statsTemplate;
    for (const stat of this.pokemonData.stats!) {
      finalTemplate = finalTemplate.replace(`{name}`, stat.name);
      finalTemplate = finalTemplate.replace(`{baseStat}`, stat.baseStat.toString());
      finalTemplate = finalTemplate.concat(this.template + '\n');
    }
    return statsTemplate;
  }

  update(data: Pokemon): void {
    throw new Error('Method not implemented.');
  }
}
