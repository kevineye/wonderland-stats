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

    $ docker run -d -p 3000:3000 kevineye/wonderland-stats --server
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

## Monitor in Home Assistant

Add these sensors to your [Home Assistant](https://www.home-assistant.io/) configuration.yaml to track Wonderland price and APY. (Make sure to fill in your server address.)

    sensor:
      - platform: rest
        name: wonderland
        resource: http://localhost:13001/wonderland/stats
        json_attributes:
          - currentIndex
          - marketCap
          - stakingAPY
          - stakingTVL
          - marketPrice
          - stakingRebase
        value_template: '{{ value_json.marketPrice | round }}'
        unit_of_measurement: USD
      - platform: template
        sensors:
          wonderland_apy:
            friendly_name: Wonderland APY
            unit_of_measurement: '%'
            value_template: '{{ (state_attr("sensor.wonderland", "stakingAPY")*100) | round }}'

Add this sensor to track your position (profit/loss). You will need to fill in the amount of wMEMO you hold for *`<your-wMEMO-holding>`* and the price you paid (in USD) for *`<your-purchase-price>`*.

The amount of wMEMO you hold is a constant that takes staking rewards of MEMO into account (the price of wMEMO increases, rather than the amount you hold increasing on each rebase). If you hold MEMO and have not wrapped it, you can get the amount of wMEMO you would hold for tracking purposes by dividing by the current index and dividing that by 4.5.

    sensor:
      - platform: template
        sensors:
          wonderland_position:
            friendly_name: Profit/loss on Wonderland
            unit_of_measurement: USD
            value_template: '{{ (state_attr("sensor.wonderland", "marketPrice") * <your-wMEMO-holding> * state_attr("sensor.wonderland", "currentIndex")*4.5 - <your-purchase-price>) | round(2) }}'

You can add this visualization, using the [mini-graph-card](https://github.com/kalkih/mini-graph-card) custom card, to your Home Assistant Lovelace UI:

    type: vertical-stack
    cards:
      - type: custom:mini-graph-card
        entities:
          - entity: sensor.wonderland_position
        hours_to_show: 48
        icon: mdi:timer-sand-empty
        name: Wonderland +/-
        points_per_hour: 4
        smoothing: false
        line_color: rgb(56, 82, 229)
        tap_action:
          action: url
          url: https://app.wonderland.money/#/dashboard
      - type: horizontal-stack
        cards:
          - type: custom:mini-graph-card
            name: Price
            entities:
              - entity: sensor.wonderland
            hours_to_show: 48
            points_per_hour: 4
            icon: mdi:currency-usd
            smoothing: false
            font_size: 70
            font_size_header: 12
            line_color: rgb(91, 157, 235)
            line_width: 8
            show:
              fill: false
          - type: custom:mini-graph-card
            name: APY
            entities:
              - entity: sensor.wonderland_apy
            hours_to_show: 48
            points_per_hour: 4
            icon: mdi:percent
            smoothing: false
            font_size: 70
            font_size_header: 12
            line_color: rgb(91, 157, 235)
            line_width: 8
            show:
              fill: false

You can add this automation to alert you to the price of TIME and your position:

    alias: Wonderland Notification
    mode: single
    trigger:
      - platform: time
        at: '12:00:00'
    action:
      - service: notify.notify
        data:
          message: >-
            TIME price is ${{ states.sensor.wonderland.state | round }} Position is
            {{ 'up' if (states.sensor.wonderland_position.state | float)>0 else 'down'
            }} ${{ states.sensor.wonderland_position.state | float | round | abs }}

You can add a TTL (Time to Lambo) card, assuming APY and market price stay the same (spoiler: they will not) with this (fill in *`<your-wMEMO-holding>`*):

    type: markdown
    title: Time to Lambo
    content: >-
      {{ (log((state_attr("sensor.wonderland", "marketPrice") * <your-wMEMO-holding> *
      state_attr("sensor.wonderland", "currentIndex") *
      4.5),(state_attr("sensor.wonderland", "stakingRebase")+1))/3) | round }} days
 