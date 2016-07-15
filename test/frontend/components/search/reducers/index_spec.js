import reducer from './../../../../../app/frontend/reducers/search';
import {
  LIST_KEY_UP,
  LIST_KEY_DOWN,
  LIST_KEY_LEFT,
  LIST_KEY_RIGHT,
  LIST_KEY_ESC,
  LIST_KEY_ENTER,
  LIST_MOUSE_OVER,
  LIST_MOUSE_CLICK,
  REQUEST_INIT,
  REQUEST_SUCCESS,
  REQUEST_FAILURE
} from './../../../../../app/frontend/constants/ActionsTypes';
import initialState from './../../../../../app/frontend/configs/searchInitialState';

describe("Requests reducers de requests", () => {
  const term = 'mús';

  it("Deve retornar o estado inicial", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("Reducer REQUEST_INIT: Espera state correto para início da requisição", () => {
    expect(reducer(initialState, {
      type: REQUEST_INIT,
      term
    })).toEqual(Object.assign({}, initialState, {
      term,
      loading: true
    }));
  });

  it("Reducer REQUEST_SUCCESS: Espera que retorno tenha o state correto e esteja ordenado", () => {
    const data = {
      hightlights: [
        {
           title: "Pop & Art",
           url: "http://g1.globo.com/pop-arte/index.html",
           logo: "http://s.glbimg.com/bu/i/fc/5fb2e18d-a47f-4bb8-9a7e-b66871cf53c0.png",
           queries: [
            "música",
            "pop",
            "art",
            "arte",
            "cultura",
            "shows"
           ]
        }
      ],
      suggestions: [
        "musica",
        "musica de anderson freire",
        "musica que neymar pediu"
      ]
    };

    const expectedData = {
      hightlights: [
        {
           "title":"Pop & Art",
           "url":"http://g1.globo.com/pop-arte/index.html",
           "logo":"http://s.glbimg.com/bu/i/fc/5fb2e18d-a47f-4bb8-9a7e-b66871cf53c0.png",
           "queries":[
            "música",
            "pop",
            "art",
            "arte",
            "cultura",
            "shows"
           ]
        }
      ],
      suggestions: [
        "musica",
        "musica que neymar pediu",
        "musica de anderson freire"
      ]
    };

    const previosState = Object.assign({}, initialState, {
      term: 'mús'
    });

    expect(reducer(previosState, {
      type: REQUEST_SUCCESS,
      term,
      data: { data }
    })).toEqual({
      openAutocomplete: true,
      term,
      indexActiveItem: -1,
      loading: false,
      completeTerm: null,
      goTo: null,
      data: {data: expectedData },
      totalResults: 6,
    });
  });

  it("Reducer REQUEST_FAILURE", () => {
    expect(reducer(initialState, {
      type: REQUEST_FAILURE,
      term,
      data: []
    })).toEqual(initialState);
  });
});

describe("Testando reducers de interactions", () => {
  const data = {
    hightlights: [
      {
         title: "Pop & Art",
         url: "http://g1.globo.com/pop-arte/index.html",
         logo: "http://s.glbimg.com/bu/i/fc/5fb2e18d-a47f-4bb8-9a7e-b66871cf53c0.png",
         queries: [
          "música",
          "pop",
          "art",
          "arte",
          "cultura",
          "shows"
         ]
      }
    ],
    suggestions: [
      "musica",
      "musica de anderson freire",
      "musica que neymar pediu"
    ]
  };

  const expectedData = {
    hightlights: [
      {
         "title":"Pop & Art",
         "url":"http://g1.globo.com/pop-arte/index.html",
         "logo":"http://s.glbimg.com/bu/i/fc/5fb2e18d-a47f-4bb8-9a7e-b66871cf53c0.png",
         "queries":[
          "música",
          "pop",
          "art",
          "arte",
          "cultura",
          "shows"
         ]
      }
    ],
    suggestions: [
      "musica",
      "musica de anderson freire",
      "musica que neymar pediu"
    ]
  };

  it("Valida retorno quando LIST_MOUSE_OVER", () => {
    expect(reducer(initialState, {
      type: LIST_MOUSE_OVER,
      indexActiveItem: 3,
    })).toEqual(Object.assign({}, initialState, {
      indexActiveItem: 3,
      openAutocomplete: true,
    }));
  });

  it("Valida retorno quando LIST_KEY_DOWN", () => {
    const dataMock = {
      data: {
        hightlights: [{}],
        suggestions: ['', '', '']
      }
    };
    const previousState = Object.assign({}, initialState, {
      data: dataMock,
      indexActiveItem: 2,
      totalResults: 6,
      openAutocomplete: true,
    });

    const expectedReturn = Object.assign({}, initialState, {
      openAutocomplete: true,
      indexActiveItem: 3,
      data: dataMock,
      totalResults: 6,
    });

    expect(reducer(previousState, {
      type: LIST_KEY_DOWN,
      indexActiveItem: 2,
      data: dataMock,
    })).toEqual(expectedReturn);
  });

  it("Valida retorno quando LIST_KEY_UP", () => {
    const dataMock = {
      data: {
        hightlights: [{}],
        suggestions: ['', '', '']
      }
    };

    const previousState = Object.assign({}, initialState, {
      data: dataMock,
      indexActiveItem: 2,
      totalResults: 6,
      openAutocomplete: true,
    });

    const expectedReturn = Object.assign({}, initialState, {
      openAutocomplete: true,
      indexActiveItem: 1,
      data: dataMock,
      totalResults: 6,
    });

    expect(reducer(previousState, {
      type: LIST_KEY_UP,
      indexActiveItem: 2,
      data: dataMock,
    })).toEqual(expectedReturn)
  });

  it("Valida retorno quando LIST_KEY_ENTER", () => {

    const dataMock = {
      data: {
        hightlights: [{
             "title":"Pop & Art",
             "url":"http://g1.globo.com/pop-arte/index.html",
             "logo":"http://s.glbimg.com/bu/i/fc/5fb2e18d-a47f-4bb8-9a7e-b66871cf53c0.png",
             "queries":[
                "música",
                "pop",
                "art",
                "arte",
                "cultura",
                "shows"
             ]
        }],
        suggestions: [
          "musica",
          "musica de anderson freire",
          "musica que neymar pediu",
        ],
      }
    };

    const state = Object.assign({}, initialState, {
      term: 'mus',
      indexActiveItem: -1,
      data: dataMock,
    });

    const expectedReturn = Object.assign({}, initialState, {
      term: 'musica de anderson freire',
      openAutocomplete: false,
      indexActiveItem: -1,
      loading: false,
      goTo: 'http://g1.globo.com/busca/?q=musica%20de%20anderson%20freire',
      completeTerm: null,
      data: dataMock,
    });

    expect(reducer(state, {
      type: LIST_KEY_ENTER,
      term: 'musica de anderson freire',
      itemType: 'suggestions',
    })).toEqual(expectedReturn);
  });



  it("Valida retorno quando LIST_MOUSE_CLICK", () => {
    const dataMock = {
      data: {
        hightlights: [{
             "title":"Pop & Art",
             "url":"http://g1.globo.com/pop-arte/index.html",
             "logo":"http://s.glbimg.com/bu/i/fc/5fb2e18d-a47f-4bb8-9a7e-b66871cf53c0.png",
             "queries":[
                "música",
                "pop",
                "art",
                "arte",
                "cultura",
                "shows"
             ]
        }],
        suggestions: [
          "musica",
          "musica de anderson freire",
          "musica que neymar pediu",
        ],
      }
    };

    const state = Object.assign({}, initialState, {
      term: 'mus',
      indexActiveItem: 1,
      data: dataMock,
    });

    const expectedReturn = Object.assign({}, initialState, {
      term: 'musica de anderson freire',
      openAutocomplete: false,
      indexActiveItem: -1,
      loading: false,
      goTo: 'http://g1.globo.com/busca/?q=musica%20de%20anderson%20freire',
      completeTerm: null,
      data: dataMock,
    });

    expect(reducer(state, {
      type: LIST_MOUSE_CLICK,
      term: 'musica de anderson freire',
      itemType: 'suggestions',
    })).toEqual(expectedReturn);
  });

  it("Valida retorno quando LIST_KEY_LEFT", () => {
    const previousState = Object.assign({}, initialState, {
      term: 'mús',
      completeTerm: 'musica',
      data: {
        data: {
          suggestions: ['musica']
        }
      }
    });

    const expectedReturn = Object.assign({}, previousState, {
      completeTerm: null,
      indexActiveItem: -1,
    });

    expect(reducer(previousState, {
      type: LIST_KEY_LEFT
    })).toEqual(expectedReturn);
  });

  it("Valida retorno quando LIST_KEY_RIGHT", () => {
    const previousState = Object.assign({}, initialState, {
      term: 'mús',
      data: {
        data: {
          suggestions: ['musica']
        }
      }
    });

    const expectedReturn = Object.assign({}, previousState, {
      completeTerm: 'musica',
      indexActiveItem: -1,
    });

    expect(reducer(previousState, {
      type: LIST_KEY_RIGHT
    })).toEqual(expectedReturn);
  });
});