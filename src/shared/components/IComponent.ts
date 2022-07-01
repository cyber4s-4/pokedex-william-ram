import Pokemon from "../utils/pokemon";

export default interface IComponent {
  parentElement: HTMLElement;
  pokemonData: Pokemon;
  template: string;
  render(): void;
  update(data: Pokemon): void;
  // eslint-disable-next-line semi
}

