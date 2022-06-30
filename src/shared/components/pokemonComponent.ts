import { Pokemon } from '../utils/pokemon';
import IComponent from './IComponent';

class PokemonComponent implements IComponent {
  parentElement: HTMLElement;
  pokemonData: Pokemon;
  template: string;
  constructor(parentElement: HTMLElement, pokemonData: Pokemon) {
    this.parentElement = parentElement;
    this.pokemonData = pokemonData;
    this.template = ``;
  }

  render(): void {
    throw new Error('Method not implemented.');
  }
  update(data: Pokemon): void {
    throw new Error('Method not implemented.');
  }
}
