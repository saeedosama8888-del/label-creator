export default function absolutize(path) {
  let startX = 0;
  let startY = 0;
  let x = 0;
  let y = 0;

  return path.map((segment) => {
    const next = segment.slice();
    const type = next[0];
    const command = type.toUpperCase();

    if (type !== command) {
      next[0] = command;
      switch (type) {
        case "a":
          next[6] += x;
          next[7] += y;
          break;
        case "v":
          next[1] += y;
          break;
        case "h":
          next[1] += x;
          break;
        default:
          for (let i = 1; i < next.length; ) {
            next[i++] += x;
            next[i++] += y;
          }
      }
    }

    switch (command) {
      case "Z":
        x = startX;
        y = startY;
        break;
      case "H":
        x = next[1];
        break;
      case "V":
        y = next[1];
        break;
      case "M":
        x = startX = next[1];
        y = startY = next[2];
        break;
      default:
        x = next[next.length - 2];
        y = next[next.length - 1];
    }

    return next;
  });
}
