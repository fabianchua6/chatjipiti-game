export const PETS = [{"id": "codex", "name": "Codex"}, {"id": "dewey", "name": "Dewey"}, {"id": "fireball", "name": "Fireball"}, {"id": "hoots", "name": "Hoots"}, {"id": "seedy", "name": "Seedy"}, {"id": "rocky", "name": "Rocky"}, {"id": "stacky", "name": "Stacky"}, {"id": "bsod", "name": "BSOD"}, {"id": "null-signal", "name": "Null Signal"}] as const;
export const PET_FACES = [
  ...PETS.map(pet => ({ ...pet, variant: 'original' as const })),
  ...PETS.map(pet => ({ ...pet, name: `Starry ${pet.name}`, variant: 'starry' as const })),
];
export const ZOOTOPIA_NAMES = ["Rabbit courier", "Fox mechanic", "Buffalo barista", "Cheetah DJ", "Sloth botanist", "Gazelle architect", "Fennec astronomer", "Sheep florist", "Lion chef", "Weasel skateboarder", "Yak knitwear artist", "Shrew violinist", "Snake scholar", "Beaver carpenter", "Lynx pilot", "Horse gardener", "Otter lifeguard", "Fox librarian"] as const;
