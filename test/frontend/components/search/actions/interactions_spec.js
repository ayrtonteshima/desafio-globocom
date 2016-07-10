import interactionsAction from './../../../../../app/frontend/components/search/actions/interactions';
import {
    LIST_KEY_UP,
    LIST_KEY_DOWN,
    LIST_KEY_LEFT,
    LIST_KEY_RIGHT,
    LIST_KEY_ESC,
    LIST_KEY_ENTER,
    LIST_MOUSE_OVER
} from './../../../../../app/frontend/components/search/constants/ActionsTypes';

describe("Testando action creators de interactions do teclado", () => {
    const KEY_ENTER     = 13;
    const KEY_ESC       = 27;
    const KEY_LEFT      = 36;
    const KEY_UP        = 38;
    const KEY_RIGHT     = 39;
    const KEY_DOWN      = 40;

    it("Testa quando pressiona ENTER em um item da lista no autocomplete aberto", () => {
        const expectedAction = {
            type: LIST_KEY_ENTER,
            term: 'musica de anderson freire'
        };

        expect(interactionsAction(KEY_ENTER, ['musica de anderson freire', 1])).toEqual(expectedAction);
    });


    it("Testa quando pressiona ESC dentro do autocomplete aberto", () => {
        const expectedAction = {
            type: LIST_KEY_ESC
        };

        expect(interactionsAction(KEY_ESC)).toEqual(expectedAction);
    });

    it("Testa quando pressiona para cima dentro do autocomplete aberto", () => {
        const expectedAction = {
            type: LIST_KEY_UP
        };

        expect(interactionsAction(KEY_UP)).toEqual(LIST_KEY_UP);
    });

    it("Testa quando pressiona para baixo dentro do autocomplete aberto", () => {
        const expectedAction = {
            type: LIST_KEY_DOWN
        };

        expect(interactionsAction(KEY_DOWN)).toEqual(LIST_KEY_DOWN);
    });

    it("Testa quando pressiona para esquerda dentro do autocomplete aberto", () => {
        const expectedAction = {
            type: LIST_KEY_LEFT
        };

        expect(interactionsAction(KEY_LEFT)).toEqual(LIST_KEY_LEFT);
    });

    it("Testa quando pressiona para direita dentro do autocomplete aberto", () => {
        const expectedAction = {
            type: LIST_KEY_RIGHT
        };

        expect(interactionsAction(KEY_RIGHT)).toEqual(LIST_KEY_RIGHT);
    });

});

describe("Testando action creators de interactions do mouse", () => {
    it("Testa quando mouse passa em cima do terceiro item da lista do autocomplete", () => {
        const expectedAction = {
            type: LIST_MOUSE_OVER,
            index: 3
        };

        expected(interactionsAction(LIST_MOUSE_OVER).toEqual(expectedAction));
    });
});
