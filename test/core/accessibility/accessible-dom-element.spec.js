import { expect } from "chai";
import * as sinon from "sinon";
import { accessibleDomElement } from "../../../src/core/accessibility/accessible-dom-element";

describe("#accessibleDomElement", () => {
    let sandbox;
    let options;
    let createElement;
    let element;
    let parentElement;
    let parentAppendChild;
    let parentRemoveChild;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
        element = document.createElement("div");
        parentAppendChild = sandbox.spy();
        parentRemoveChild = sandbox.spy();
        parentElement = {
            appendChild: parentAppendChild,
            removeChild: parentRemoveChild,
        };
        options = {
            id: "play-button",
            parent: parentElement,
            onClick: () => {},
            onMouseOver: () => {},
            onMouseOut: () => {},
        };
        createElement = sandbox.stub(document, "createElement").returns(element);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("Initialize", () => {
        it("creates new div element", () => {
            accessibleDomElement(options);
            sinon.assert.calledOnce(createElement.withArgs("div"));
        });

        it("sets the id to 'play-button", () => {
            accessibleDomElement(options);
            expect(element.getAttribute("id")).to.equal("play-button");
        });

        it("sets tabindex to 0", () => {
            accessibleDomElement(options);
            expect(element.getAttribute("tabindex")).to.equal("0");
        });

        it("sets aria-hidden to false by default", () => {
            accessibleDomElement(options);
            expect(element.getAttribute("aria-hidden")).to.equal("false");
        });

        it("sets aria-hidden to the given value", () => {
            options.ariaHidden = true;
            accessibleDomElement(options);
            expect(element.getAttribute("aria-hidden")).to.equal("true");
        });

        it("does not have an aria-label by default", () => {
            accessibleDomElement(options);
            expect(element.getAttribute("aria-label")).to.equal(null);
        });

        it("sets an aria-label if given", () => {
            options.ariaLabel = "Play button";
            accessibleDomElement(options);
            expect(element.getAttribute("aria-label")).to.equal(options.ariaLabel);
        });

        it("sets aria-hidden to correct value", () => {
            accessibleDomElement(options);
            expect(element.getAttribute("aria-hidden")).to.equal("false");
        });

        it("sets role to correct value", () => {
            accessibleDomElement(options);
            expect(element.getAttribute("role")).to.equal("button");
        });

        it("sets style position to absolute", () => {
            accessibleDomElement(options);
            expect(element.style.position).to.equal("absolute");
        });

        it("sets cursor to  the correct value", () => {
            accessibleDomElement(options);
            expect(element.style.cursor).to.equal("pointer");
        });

        it("sets inner text to be empty by default", () => {
            accessibleDomElement(options);
            expect(element.innerHTML).to.equal("");
        });

        it("sets inner text if given", () => {
            options.text = "Text goes here";
            accessibleDomElement(options);
            expect(element.innerHTML).to.equal(options.text);
        });

        it("adds an event listener for keyup", () => {
            const eventListener = sandbox.stub(element, "addEventListener");
            accessibleDomElement(options);
            sinon.assert.calledOnce(eventListener.withArgs("keyup", sinon.match.func));
        });

        it("adds an event listener for click", () => {
            const eventListener = sandbox.stub(element, "addEventListener");
            accessibleDomElement(options);
            sinon.assert.calledOnce(eventListener.withArgs("click", sinon.match.func));
        });

        it("adds an event listener for mouseover", () => {
            const eventListener = sandbox.stub(element, "addEventListener");
            accessibleDomElement(options);
            sinon.assert.calledOnce(eventListener.withArgs("mouseover", sinon.match.func));
        });

        it("adds an event listener for mouseleave", () => {
            const eventListener = sandbox.stub(element, "addEventListener");
            accessibleDomElement(options);
            sinon.assert.calledOnce(eventListener.withArgs("mouseleave", sinon.match.func));
        });

        it("adds an event listener for focus", () => {
            const eventListener = sandbox.stub(element, "addEventListener");
            accessibleDomElement(options);
            sinon.assert.calledOnce(eventListener.withArgs("focus", sinon.match.func));
        });

        it("adds an event listener for blur", () => {
            const eventListener = sandbox.stub(element, "addEventListener");
            accessibleDomElement(options);
            sinon.assert.calledOnce(eventListener.withArgs("blur", sinon.match.func));
        });

        it("appends element to parent element", () => {
            accessibleDomElement(options);
            sinon.assert.calledOnce(parentAppendChild.withArgs(element));
        });
    });

    describe("Accessing the created element", () => {
        it("returns element when calling el function on the module", () => {
            const newAccessibleElement = accessibleDomElement(options);
            expect(newAccessibleElement.el).to.equal(element);
        });
    });

    describe("hiding the element", () => {
        it("hides element when calling hide function on the module", () => {
            const newAccessibleElement = accessibleDomElement(options);
            newAccessibleElement.hide();
            expect(element.getAttribute("aria-hidden")).to.equal("true");
            expect(element.getAttribute("tabindex")).to.equal("-1");
            expect(element.style.visibility).to.equal("hidden");
        });
    });

    describe("showing the element", () => {
        it("shows element when calling show function on the module", () => {
            element.setAttribute("aria-hidden", "true");
            element.setAttribute("tabindex", "-1");
            element.style.visibility = "hidden";

            const newAccessibleElement = accessibleDomElement(options);
            newAccessibleElement.show();

            expect(element.getAttribute("aria-hidden")).to.equal("false");
            expect(element.getAttribute("tabindex")).to.equal("0");
            expect(element.style.visibility).to.equal("visible");
        });
    });

    describe("checking visibility of element", () => {
        it("calling visible function returns true when element is visible", () => {
            const newAccessibleElement = accessibleDomElement(options);
            newAccessibleElement.show();
            expect(newAccessibleElement.visible()).to.equal(true);
        });

        it("calling visible function returns false when element is not visible", () => {
            const newAccessibleElement = accessibleDomElement(options);
            newAccessibleElement.hide();
            expect(newAccessibleElement.visible()).to.equal(false);
        });
    });

    describe("setting position of element via position function", () => {
        it("sets css values correctly", () => {
            const newAccessibleElement = accessibleDomElement(options);
            const positionOptions = {
                x: 50,
                y: 50,
                width: 200,
                height: 100,
            };
            newAccessibleElement.position(positionOptions);
            expect(element.style.left).to.equal("50px");
            expect(element.style.top).to.equal("50px");
            expect(element.style.width).to.equal("200px");
            expect(element.style.height).to.equal("100px");
        });
    });

    describe("removing element", () => {
        it("is removed from DOM when calling remove function", () => {
            const newAccessibleElement = accessibleDomElement(options);
            newAccessibleElement.remove();
            sinon.assert.calledOnce(parentRemoveChild.withArgs(element));
        });
    });
});