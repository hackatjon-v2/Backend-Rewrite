export interface Layer {
  handle: () => any;
  name: string;
  params: object;
  path: string;
  keys: any[];
  route: Route;
}

export interface Route {
  path: string;
  stack: any[];
  methods: object;
}

export type Stack = Layer[];
