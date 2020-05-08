const ERC721Impl = artifacts.require("ERC721Impl");

contract("ERC721Impl", (accounts) => {
    let [alice, bob] = accounts;
    let contractInstance;
    beforeEach(async () => {
        contractInstance = await ERC721Impl.new();
    });
    it("should be able to create a new token", async () => {
        const result = await contractInstance.mint("123456", {from: alice});
        assert.equal(result.receipt.status, true);
        assert.equal(result.logs[0].args.tokenId,"123456");
    })

    it("should be able to burn token", async () => {
        await contractInstance.mint("789", {from: alice});
        const result = await contractInstance.burn("789", {from: alice});
        assert.equal(result.receipt.status, true);
        assert.equal(result.logs[0].args._from,alice);
    })

    context("with the single-step transfer scenario", async () => {
        it("should transfer a token", async () => {
            const result = await contractInstance.mint("123456", {from: alice});
            const tokenId = result.logs[0].args.tokenId.toNumber();
            await contractInstance.transferFrom(alice, bob, tokenId, {from: alice});
            const newOwner = await contractInstance.ownerOf(tokenId);
            assert.equal(newOwner, bob);
        })
    })
    context("with the two-step transfer scenario", async () => {
        it("should approve and then transfer a token when the approved address calls transferForm", async () => {
            const result = await contractInstance.mint("123456", {from: alice});
            const tokenId = result.logs[0].args.tokenId.toNumber();
            await contractInstance.approve(bob, tokenId, {from: alice});
            await contractInstance.transferFrom(alice, bob, tokenId, {from: bob});
            const newOwner = await contractInstance.ownerOf(tokenId);
            assert.equal(newOwner,bob);
        })
        it("should approve and then transfer a token when the owner calls transferForm", async () => {
            const result = await contractInstance.mint("123456", {from: alice});
            const tokenId = result.logs[0].args.tokenId.toNumber();
            await contractInstance.approve(bob, tokenId, {from: alice});
            await contractInstance.transferFrom(alice, bob, tokenId, {from: alice});
            const newOwner = await contractInstance.ownerOf(tokenId);
            assert.equal(newOwner,bob);
         })
    })

})
