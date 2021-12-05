# Wonderland Stats

Retrieve [Wonderland TIME/MEMO](https://www.wonderland.money/) stats via command line or simple web service. Based directly on code from the [Wonderland-Money frontend github repo](https://github.com/Wonderland-Money/wonderland-frontend/commit/19a9eecd8d9794b058cbfac90967c338717889b2).

## CLI

    $ docker run --rm kevineye/wonderland-stats
    {
      "currentIndex": 4.8570300544444445,
      "totalSupply": 444810.303291205,
      "marketCap": 2796665424.979031,
      "currentBlock": 7822990,
      "circSupply": 292524.719268054,
      "fiveDayRate": 0.09464655511835995,
      "stakingAPY": 735.1999277680334,
      "stakingTVL": 1839196984.1424303,
      "stakingRebase": 0.006046978298080455,
      "marketPrice": 6287.321593690988,
      "currentBlockTime": 1638675322,
      "nextRebase": 1638684000
    }
    
## Server

    $ docker run -d kevineye/wonderland-stats --server
    $ curl http://localhost:3000/wonderland-stats
    {
      "currentIndex": 4.8570300544444445,
      "totalSupply": 444810.303291205,
      "marketCap": 2796665424.979031,
      "currentBlock": 7822990,
      "circSupply": 292524.719268054,
      "fiveDayRate": 0.09464655511835995,
      "stakingAPY": 735.1999277680334,
      "stakingTVL": 1839196984.1424303,
      "stakingRebase": 0.006046978298080455,
      "marketPrice": 6287.321593690988,
      "currentBlockTime": 1638675322,
      "nextRebase": 1638684000
    }
