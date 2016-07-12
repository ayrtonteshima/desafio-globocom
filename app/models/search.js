import searchMock from './../../mocks/searchMock';

function getAll(data = null) {
  // Possibilidade para injetar um mock:
  // if (data) return data;

  // Aqui vem a requisição para ir ao mongo/redis pegar os dados
  // Code
  // fim

  return Promise.resolve(data);
}

export function get() {
  return getAll(searchMock);
}
