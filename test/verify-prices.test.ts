import { expect } from "chai";
import { BigNumber } from "ethers";
import { formatBytes32String } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { SampleForLocalhostMockTest } from "../typechain-types";
import { WrapperBuilder } from "redstone-evm-connector";

const getCacheServiceUrl = (): string => {
  if (process.env.CACHE_SERVICE_URLS) {
    return JSON.parse(process.env.CACHE_SERVICE_URLS) as string;
  } else {
    return "http://localhost:9000";
  }
};

// This test is used in monorepo integration tests
describe("verify prices test", function () {
  let contract: SampleForLocalhostMockTest;
  const pricesToVerify = JSON.parse(process.env.PRICES_TO_CHECK ?? "[]") as {
    [token: string]: number;
  };

  const testAsset = async (dataFeedId: string, expectedPrice: number) => {
    const wrappedContract = WrapperBuilder.wrapLite(contract).usingPriceFeed(
      "custom",
      {
        asset: dataFeedId,
        dataSources: {
          sources: [
            {
              type: "cache-layer",
              url: getCacheServiceUrl(),
              evmSignerAddress: "0x41ed5321B76C045f5439eCf9e73F96c6c25B1D75",
              providerId: "redstone-primary-demo",
            },
          ],
          valueSelectionAlgorithm: "newest-valid",
          timeoutMilliseconds: 10000,
          maxTimestampDiffMilliseconds: 150000,
          preVerifySignatureOffchain: false,
        },
      }
    );

    const oracleValue = await wrappedContract.extractOracleValuesView(
      formatBytes32String(dataFeedId)
    );

    expect(oracleValue).to.be.equal(BigNumber.from(expectedPrice * 10 ** 8));
  };

  this.beforeEach(async () => {
    const ContractFactory = await ethers.getContractFactory("SampleForLocalhostMockTest");
    contract = await ContractFactory.deploy();
    await contract.deployed();
  });

  it("Should properly extract prices with small data packages", async () => {
    await Promise.all(
      Object.entries(pricesToVerify).map(([asset, price]) =>
        testAsset(asset, price)
      )
    );
  });
});
