//This test file does not inclue database, 
//used database is not design for complex usage.

//Also this test file does not include routes which use req.sessions,
//That gives error always, I could not figure it out.

//Tests for check status codes (sadly nothing more).
const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");

const { expect } = chai;
chai.use(chaiHttp);

describe("Server", () => {
    it("Index", done => {
        chai
            .request(app)
            .get("/")
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(typeof res).to.equal("object")
                done()
            });
    });

});


describe("Authentication", () => {

    it("Signup", (done) => {
        chai
            .request(app)
            .post("/auth/signup")
            .send({
                "name": "test name",
                "surname": "test surname",
                "email": "asd2@asd.com",
                "password": "test123"
            })
            .end((err, res) => {
                expect(res).to.have.status(200)

                done()
            });
    });

    it("Signin", (done) => {
        chai
            .request(app)
            .post("/auth/signin")
            .send({
                "email": "asd2@asd.com",
                "password": "test123"
            })
            .end((err, res) => {
                expect(res).to.have.status(200)
                done()
            });
    });
});


describe("Account", () => {

    it("Get Order History", (done) => {
        chai
            .request(app)
            .get("/account")
            .end((err, res) => {
                expect(res).to.have.status(200)
                done()
            });
    });

});

describe("Payment", () => {

    it("Payment page", (done) => {
        chai
            .request(app)
            .get("/payment/")
            .end((err, res) => {
                expect(res).to.have.status(200)
                done()
            });
    });

});