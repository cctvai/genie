import { assert, expect } from "chai";
import * as sinon from "sinon";

import * as ButtonFactory from "../../../src/core/layout/button-factory";
import * as GelButton from "../../../src/core/layout/gel-button";
import * as accessibilify from "../../../src/lib/accessibilify/accessibilify";

describe("Layout - Button Factory", () => {
    let accessibilifyStub;
    let buttonFactory;
    let gelButtonStub;
    let mockGame;

    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        accessibilifyStub = sandbox.stub(accessibilify, "accessibilify");
        gelButtonStub = sandbox.stub(GelButton, "GelButton");

        mockGame = { canvas: () => {}, mockGame: "game" };
        buttonFactory = ButtonFactory.create(mockGame);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("create method", () => {
        it("returns correct methods", () => {
            assert.exists(buttonFactory.createButton);
        });
    });

    describe("createButton method", () => {
        const expectedIsMobile = false;
        const expectedKey = "buttonKey";

        beforeEach(() => {
            buttonFactory.createButton(expectedIsMobile, expectedKey);
        });

        it("creates a GEL button", () => {
            const actualParams = gelButtonStub.getCall(0).args;
            expect(actualParams.length).to.equal(5);
            expect(actualParams[0]).to.eql(mockGame);
            expect(actualParams[1]).to.equal(0);
            expect(actualParams[2]).to.equal(0);
            expect(actualParams[3]).to.equal(expectedIsMobile);
            expect(actualParams[4]).to.equal(expectedKey);
        });

        it("makes the button accessibile", () => {
            expect(accessibilifyStub.called).to.equal(true);
        });
    });
});