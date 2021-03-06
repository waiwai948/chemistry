import Konva from "konva";
import type Item from "@/model/item";

export function haveIntersection(r1, r2) {
  return !(
    r2.x > r1.x + r1.width ||
    r2.x + r2.width < r1.x ||
    r2.y > r1.y + r1.height ||
    r2.y + r2.height < r1.y
  );
}

export function drawProduct(container, reactResp) {
  const liquidList = [],
    solidList = [],
    gasList = [];
  reactResp.forEach((item) => {
    item.chemList?.forEach((chem) => {
      switch (chem.physicalType) {
        case 0:
          solidList.push(chem);
          break;
        case 1:
          liquidList.push(chem);
          break;
        case 2:
          gasList.push(chem);
          break;
      }
    });
  });
  liquidList.forEach((item) => {
    container.addItem({
      name: item.formula,
      attribute: "liquid",
      ...item,
    });
  });
  solidList.forEach((item) => {
    if (item.waterSolubility) {
      container.addItem({
        name: item.formula,
        attribute: "liquid",
        ...item,
      });
    } else {
      container.addItem({
        name: item.formula,
        attribute: "solid",
        ...item,
      });
    }
  });

  gasList.forEach((item) => {
    container.addItem({
      name: item.formula,
      attribute: "gas",
      ...item,
    });
  });
}

export function drawLabel(container, reactResp) {
  if (reactResp[0]) {
    const { expression, ruleDesc } = reactResp[0];
    const { width, height } = container;
    // tooltip
    var tooltip = new Konva.Label({
      x: -40,
      y: -100,
    });

    tooltip.add(
      new Konva.Tag({
        fill: "black",
        pointerWidth: 10,
        pointerHeight: 10,
        lineJoin: "round",
        shadowColor: "green",
        shadowBlur: 10,
        shadowOffsetX: 10,
        shadowOffsetY: 10,
        shadowOpacity: 0.5,
      })
    );

    tooltip.add(
      new Konva.Text({
        text: `${expression}\r\n\n${ruleDesc}`,
        fontFamily: "Calibri",
        fontSize: 14,
        padding: 10,
        fill: "white",
      })
    );
    container.instance.add(tooltip);
    container.includesDraw.push(tooltip);
  }
}
export function drawLiquid(container, item) {
  const { width, height } = container;

  let A = 2,
    W = 1 / 2,
    Q = 0,
    H = (3 * height) / 5;
  // speed = -0.000001;
  var triangle = new Konva.Shape({
    x: 0,
    y: 0,
    sceneFunc: function (ctx, shape) {
      (function drawAnimation() {
        ctx.beginPath();
        ctx.moveTo(32, H);
        // Q += speed;
        for (let xm = 32; xm <= width - 22; xm++) {
          let ym = A * Math.sin(W * xm + Q) + H;
          ctx.lineTo(xm, ym);
        }
        ctx.stroke();
        ctx.lineTo(width - 22, height - 11);
        ctx.lineTo(32, height - 11);
        ctx.fill();
        ctx.closePath();
      })();

      // (!) Konva specific method, it is very important
      ctx.fillStrokeShape(shape);
    },
    fill: item.color,
    stroke: item.color,
    lineWidth: 1,
    strokeWidth: 1,
    opacity: 0.7,
  });
  container.includesDraw.push(triangle);
  container.instance.add(triangle);
}

export function drawSolid(container, item: Item) {
  const { width, height } = container;

  for (let index = 8; index < 15; index++) {
    const hexagon = new Konva.RegularPolygon({
      x: (index * width) / 20,
      y: height - 20 - Math.random() * 5,
      sides: 7,
      radius: 6,
      fill: item.color,
      stroke: "black",
      dash: [1, 2, 3],
      strokeWidth: 1,
      opacity: 0.8,
    });
    container.includesDraw.push(hexagon);
    container.instance.add(hexagon);
  }
}

export function drawBubble(container, item: Item) {
  const { width, height } = container;
  for (let i = 0; i < 30; i++) {
    let xRange = Math.min(width - 30, Math.random() * width);
    let circleX = xRange > 40 ? xRange : 40;
    const circle = new Konva.Circle({
      x: circleX,
      y: height - 10,
      radius: Math.random() * 5,
      fill: item.color,
      opacity: 0.9,
      name: "shape-" + i,
    });
    container.instance.add(circle);
    const tween = new Konva.Tween({
      node: circle,
      duration: (Math.random() + 0.6) * 4,
      y: (Math.random() + 1) * 10,
      opacity: 0.1,
      onFinish: () => {
        circle.destroy();
      },
    });
    setTimeout(() => {
      tween.play();
    }, 100 * i);
  }
}
