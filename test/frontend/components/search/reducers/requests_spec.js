import reducer from './../../../../../app/frontend/components/search/reducers/';
import {
    REQUEST_INIT,
    REQUEST_SUCCESS,
    REQUEST_FAILURE
} from './../../../../../app/frontend/components/search/constants/ActionsTypes';

describe("Requests reducers de requests", () => {
    const term = 'mús';

    it("Deve retornar o estado inicial", () => {
        const initialState = {
          openAutocomplete: false,
          term: '',
          indexItemActive: -1,
          loading: false
        };

        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it("Manipula REQUEST_INIT", () => {
        expect(reducer(undefined, {
            type: REQUEST_INIT,
            term
        })).toEqual({
            loading: true,
            term,
            openAutocomplete: false
        });
    });

    it("Manipula REQUEST_SUCCESS", () => {
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

        const expectedData = [
            {
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
                    "<mark>mus</mark>ica",
                    "<mark>mus</mark>ica de anderson freire",
                    "<mark>mus</mark>ica que neymar pediu"
                ]
            }
        ];

        expect(reducer({
            type: REQUEST_SUCCESS,
            term,
            data
        })).toEqual({
            loading: false,
            term: 'mús',
            openAutocomplete: true,
            data: expectedData
        });
    });

    it("Manipula REQUEST_FAILURE", () => {
        expect(reducer({
            type: REQUEST_FAILURE,
            term,
            data: []
        })).toEqual({
            loading: false,
            term: 'mús',
            openAutocomplete: true
        });
    });
});