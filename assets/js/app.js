//// Variables
// import { html } from 'common-tags';
// convertedCode =
let newCodeArea = document.getElementById("converted-code");
let oldCodeArea = document.getElementById("raw-code");
//// Event listeners
eventListeners();
/// set initial values

document.getElementById("raw-code").value = ` <--->This is just for demo<--->
# description
trigger
body
# description
trigger
body`;

function eventListeners() {
  document.querySelector("#vsc").addEventListener("click", pasteToRight);
  document.querySelector("#sublime").addEventListener("click", pasteToRight);
  document.querySelector("#atom").addEventListener("click", pasteToRight);
  document.querySelector("#test").addEventListener("click", pasteToRight);
  document.querySelector("#copy").addEventListener("click", pasteToClipBoard);
  document.querySelector("#vsc-sublime").addEventListener("click", vscTransform);
  document.querySelector("#vsc-atom").addEventListener("click", vscTransform);
  document.querySelector("#atom-sublime").addEventListener("click", atomTransform);
  document.querySelector("#atom-vsc").addEventListener("click", atomTransform);
  document.querySelector('#right-to-left').addEventListener("click",copyRightToLeft)
  document.querySelector("#sublime-vsc").addEventListener("click", sublimeTransform);
  document.querySelector("#sublime-atom").addEventListener("click", sublimeTransform);
}

function copyRightToLeft() {
  oldCodeArea.value =  newCodeArea.value;
}

function atomTransform(event) {
  let rawCodeVsc = document.getElementById('raw-code').value;
  let rawCodeZone = document.getElementById('raw-code');
  let eventId = event.target.id
  let separatedSnippets, separatedSnippetsLength;
  // separatedSnippetsInfo = separateLines(rawCode);
  separatedSnippetsInfo = separateLinesOthers(rawCodeVsc);
  [separatedSnippets, separatedSnippetsLength] = separatedSnippetsInfo;
  // record chunks position
  let beginningAndEnd = [];
  let description = [],
      body = [],
      prefix = [];
  // newCodeArea.value = "";
  rawCodeZone.value = "";
  for (let i = 0; i < separatedSnippetsLength; i++) {
    if (separatedSnippets[i].includes("'prefix':")) {
      beginningAndEnd.push(i-1);
    } else if (separatedSnippets[i].includes('"""') && !separatedSnippets[i].includes('body'))
      {
        beginningAndEnd.push(i);
      }
  }
  // get various segments
  for (let i = 0; i < beginningAndEnd.length; i+=2) {
      // get description
        description = separatedSnippets[beginningAndEnd[i]].slice(1,-2) +"\n";
        // get prefix with search
        prefix = separatedSnippets[beginningAndEnd[i]+1].slice(separatedSnippets[beginningAndEnd[i]+1].indexOf("prefix")+10,-1) + "\n";
        // process and add body (remove double quotes and comma)
        for (let j = beginningAndEnd[i]+3; j < beginningAndEnd[i+1]; j++) {
          // remove leading white spaces
          separatedSnippets[j] = separatedSnippets[j].replace(/^\s{4}/g,"");
        }
        console.log(separatedSnippets);
        body = separatedSnippets.slice(beginningAndEnd[i]+3,beginningAndEnd[i+1]).join("\n");
        console.log(body);
        // if (beginningAndEnd.length === 4) {
        //   rawCodeZone.value += "# " + description + prefix + body;
        // } else {
        //   rawCodeZone.value += "# " + description + prefix + body + "\n";}
        // add convert back to raw code
        rawCodeZone.value += "# " + description + prefix + body + "\n";
        pasteToRight(event);
  }
}

function sublimeTransform(event) {
  let rawCodeVsc = document.getElementById('raw-code').value;
  let rawCodeZone = document.getElementById('raw-code');
  let eventId = event.target.id
  let separatedSnippets, separatedSnippetsLength;
  // separatedSnippetsInfo = separateLines(rawCode);
  separatedSnippetsInfo = separateLinesOthers(rawCodeVsc);
  [separatedSnippets, separatedSnippetsLength] = separatedSnippetsInfo;
  // record chunks position
  let beginningAndEnd = [];
  let description = [],
      body = [],
      prefix = [];
  // newCodeArea.value = "";
  rawCodeZone.value = "";
  for (let i = 0; i < separatedSnippetsLength; i++) {
    if (separatedSnippets[i].includes("<content><!")) {
      beginningAndEnd.push(i);
    } else if (separatedSnippets[i].includes(']]></content>'))
      {
        beginningAndEnd.push(i);
      } else if (separatedSnippets[i].includes('tabTrigger'))
      {
        beginningAndEnd.push(i);
      } else if (separatedSnippets[i].includes('description')) {
        beginningAndEnd.push(i);
      }
  }
  console.log(beginningAndEnd);
  // get various segments
  for (let i = 0; i < beginningAndEnd.length; i+=4) {
      // get description
        description = separatedSnippets[beginningAndEnd[i+3]].slice(15,-14) + "\n";
        // get prefix with search
        prefix = separatedSnippets[beginningAndEnd[i+2]].slice(14,-13) +"\n";
        // process and add body (remove double quotes and comma)
        // for (let j = beginningAndEnd[i]+3; j < beginningAndEnd[i+1]; j++) {
        //   // remove leading white spaces
        //   separatedSnippets[j] = separatedSnippets[j].replace(/^\s{4}/g,"");
        // }
        console.log(separatedSnippets);
        body = separatedSnippets.slice(beginningAndEnd[i]+1,beginningAndEnd[i+1]).join("\n");
        console.log(body);
        // add convert back to raw code
        // if (beginningAndEnd.length === 4) {
        //   rawCodeZone.value += "# " + description + prefix + body;
        // } else {
          rawCodeZone.value += "# " + description + prefix + body + "\n";
        pasteToRight(event);
  }
}


function vscTransform(event) {
  let rawCodeVsc = document.getElementById('raw-code').value;
  let rawCodeZone = document.getElementById('raw-code');
  let eventId = event.target.id
  let separatedSnippets, separatedSnippetsLength;
  // separatedSnippetsInfo = separateLines(rawCode);
  separatedSnippetsInfo = separateLinesVsc(rawCodeVsc);
  [separatedSnippets, separatedSnippetsLength] = separatedSnippetsInfo;
  // record chunks position
  let beginningAndEnd = [];
  let description = [],
      body = [],
      prefix = [];
  // newCodeArea.value = "";
  rawCodeZone.value = "";
  for (let i = 0; i < separatedSnippetsLength; i++) {
    if (separatedSnippets[i].slice(-3,) === ": {" || separatedSnippets[i].slice(-2,) === "}," || separatedSnippets[i].slice(-1) === "}") {
      beginningAndEnd.push(i);
    }
  }
  console.log(beginningAndEnd);
  for (let i = 0; i < beginningAndEnd.length; i+=2) {
      // get description
        description = separatedSnippets[beginningAndEnd[i]].slice(1,-4) +"\n";
        // get prefix
        prefix = separatedSnippets[beginningAndEnd[i]+1].slice(13,-2) + "\n";
        // process and add body (remove double quotes and comma)
        for (let j = beginningAndEnd[i]+3; j < beginningAndEnd[i+1]-2; j++) {
          if (j !== beginningAndEnd[i+1]-3) {
            separatedSnippets[j] = separatedSnippets[j].slice(5,-2);
          } else {
            separatedSnippets[j] = separatedSnippets[j].slice(5,-1);
          }
        }
        console.log(separatedSnippets);
        body = separatedSnippets.slice(beginningAndEnd[i]+3,beginningAndEnd[i+1]-2).join("\n");
        console.log(body);
        // if (beginningAndEnd.length === 4) {
        //   rawCodeZone.value += "# " + description + prefix + body;
        // } else {
          rawCodeZone.value += "# " + description + prefix + body + "\n";
        // add convert back to raw code
        // rawCodeZone.value += "# " + description + prefix + body + "\n";
        pasteToRight(event);
  }
}

function pasteToClipBoard() {
  let copyText = document.getElementById("converted-code");
  copyText.select();
  document.execCommand("copy");
}
//// Functions
function separateLines(code) {
  let separated = code
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .split("\n");
  return [separated, separated.length];
}

function separateLinesOthers(code) {
  let separated = code
    .replace(/\\/g, "\\\\")
    .split("\n");
  return [separated, separated.length];
}
function separateLinesVsc(code) {
  let separated = code
    // .replace(/\\/g, "\\\\")
    .replace(/\\"/g,'"')
    .split("\n");
  return [separated, separated.length];
}


function getIndexPositions(snippets, length) {
  let indexDescription = [];
  for (let i = 0; i < length; i++) {
    if (snippets[i][0] === "#") {
      indexDescription.push(i);
    }
  }
  return indexDescription;
}

function getBodyPositions(referencePositionArray, length, x) {
  let indexBody = [];
  for (let i = 0; i < length; i++) {
    // beginning
    indexBody.push(referencePositionArray[i] + 2);
    // end
    if (i !== referencePositionArray.length - 1) {
      indexBody.push(referencePositionArray[i + 1] - 1);
    } else {
      indexBody.push(x - 1);
    }
  }
  return indexBody;
}

function pasteToRight(event) {
  event.preventDefault();
  const eventId = event.target.id;
  // get rawcode
  let rawCode = document.getElementById("raw-code").value;
  // console.log(rawCode);
  // get separated lines and total number of lines
  let separatedSnippets, separatedSnippetsLength;
  if (eventId === "vsc") {
    separatedSnippetsInfo = separateLines(rawCode);
  } else if (eventId === "vsc-sublime" || eventId === "vsc-atom") {
    separatedSnippetsInfo = separateLinesVsc(rawCode);
  } else {
    separatedSnippetsInfo = separateLinesOthers(rawCode);
  }

  console.log("pasteRight" + separatedSnippetsInfo);

  [separatedSnippets, separatedSnippetsLength] = separatedSnippetsInfo;
  // convertedSnippets = "";
  // for (let i = 0; i < separatedSnippetsLength; i++) {
  //   if(separatedSnippets[i][-1] === "{"))
  // }
  // }

  // [separatedSnippets, separatedSnippetsLength] = separatedSnippetsInfo;
  // get description index = get positions of lines beginning with #
  const indexDescription = getIndexPositions(
    separatedSnippets,
    separatedSnippetsLength
  );
  const lengthDescription = indexDescription.length;
  // get body position = slice(#.position + 2, next #.position
  const indexBody = getBodyPositions(
    indexDescription,
    lengthDescription,
    separatedSnippetsLength
  );
  const lengthBody = indexBody.length;

  // process body if vsc and atom format = add different number of spaces according to positions
  // if = for each chunk start + 2 spaces otherwise + 4 spaces
  if (eventId === "vsc" || eventId === "test" || eventId === "atom-vsc" || eventId === "sublime-vsc") {
    for (let i = 0; i < lengthBody; i += 2) {
      // loop each chunk
      for (let j = indexBody[i]; j <= indexBody[i + 1]; j++) {
        if (j === indexBody[i] && j !== indexBody[i+1]) {
          separatedSnippets[j] = '  "' + separatedSnippets[j] + '",';
        } else if (j < indexBody[i + 1]) {
          separatedSnippets[j] = '    "' + separatedSnippets[j] + '",';
        } else if (indexBody[i+1]-indexBody[i] === 0) {
          separatedSnippets[j] = '  "' + separatedSnippets[j] + '"';
        } else {
          separatedSnippets[j] = '    "' + separatedSnippets[j] + '"';
        }
      }
    }
  } else if (eventId === "atom" || eventId === "vsc-atom" || eventId === "sublime-atom") {
    for (let i = 0; i < lengthBody; i += 2) {

      for (let j = indexBody[i]; j <= indexBody[i + 1]; j++) {
          separatedSnippets[j] = '    ' + separatedSnippets[j];
        }
    }
  }

  // console.log(separatedSnippets);

  // define newCodeSnippets
  newCodeArea.value = "";
  if (eventId === "vsc" || eventId === "test" || eventId === "sublime-vsc" || eventId === "atom-vsc") {
    // do vsc
    for (let i = 0; i < lengthBody; i += 2) {
      // add , to end if not the last body
      if (i !== lengthBody - 2) {
        newCodeArea.value += `"${separatedSnippets[indexBody[i] - 2].slice(
          2
        )}": {
  "prefix": "${separatedSnippets[indexBody[i] - 1]}",
  "body": [
  ${separatedSnippets.slice(indexBody[i], indexBody[i + 1] + 1).join("\n")}
  ],
  "description": "${separatedSnippets[indexBody[i] - 2].slice(2)}"
},\n\n`;
        // last body
      } else {
        newCodeArea.value += `"${separatedSnippets[indexBody[i] - 2].slice(
          2
        )}": {
  "prefix": "${separatedSnippets[indexBody[i] - 1]}",
  "body": [
  ${separatedSnippets.slice(indexBody[i], indexBody[i + 1] + 1).join("\n")}
  ],
  "description": "${separatedSnippets[indexBody[i] - 2].slice(2)}"
}`;
      }
    }
  } else if (eventId === "sublime" || eventId === "vsc-sublime" || eventId === "atom-sublime") {
    // do sublime
    for (let i = 0; i < lengthBody; i += 2) {
        newCodeArea.value += "<snippet>\n" +
        "  <content><![CDATA[\n" +
        separatedSnippets.slice(indexBody[i], indexBody[i + 1] + 1).join("\n")
         +
        "\n]]></content>\n" +
        "  <tabTrigger>"+ separatedSnippets[indexBody[i] - 1] + "</tabTrigger>\n" +
        "  <description>"+ separatedSnippets[indexBody[i] - 2].slice(2,) +"</description>\n</snippet>\n\n"
    }
  } else if (eventId === "atom" || eventId === "sublime-atom" || eventId === "vsc-atom") {
    // do atom
    for (let i = 0; i < lengthBody; i += 2) {
        newCodeArea.value += "'" + separatedSnippets[indexBody[i] - 2].slice(2,) + "':\n" +
        "  'prefix': " + "'" +separatedSnippets[indexBody[i] - 1] + "'\n" +
        "  'body': " + '"""\n' +
        separatedSnippets.slice(indexBody[i], indexBody[i + 1] + 1).join("\n") + "\n" +
        "  " + '"""\n\n'
    }
  }
  console.log("end" + newCodeArea.value);
  // oldCodeArea.value = code;
}