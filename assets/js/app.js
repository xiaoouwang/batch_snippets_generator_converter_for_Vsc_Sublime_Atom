//// Variables
// import { html } from 'common-tags';

// convertedCode =
let newCodeArea = document.getElementById('converted-code');

//// Event listeners
eventListeners();

function eventListeners() {
  document.querySelector('#original-form').addEventListener('submit',pasteToRight);
}

//// Functions
function separateLines(code) {
  let separated = code
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .split("\n");
  return [separated,separated.length];
}

function getIndexPositions(snippets,length) {
  let indexDescription = [];
  for (let i = 0; i < length; i++) {
    if (snippets[i][0] === "#") {
      indexDescription.push(i)
    }
  }
  return indexDescription;
}

function getBodyPositions(referencePositionArray,length,x) {
  let indexBody = [];
  for (let i = 0; i < length; i++) {
    // beginning
    indexBody.push(referencePositionArray[i]+2);
    // end
    if (i !== referencePositionArray.length-1)
      {indexBody.push(referencePositionArray[i+1]-1);} else {
        indexBody.push(x-1);
      }
  }
  return indexBody;
}

function pasteToRight(event) {
  event.preventDefault();
  // get rawcode
  let rawCode = document.getElementById('raw-code').value;
  // get separated lines and total number of lines
  let separatedSnippets, separatedSnippetsLength;
  const separatedSnippetsInfo = separateLines(rawCode);
  [separatedSnippets,separatedSnippetsLength] = separatedSnippetsInfo;
  // get description index = get positions of lines beginning with #
  const indexDescription = getIndexPositions(separatedSnippets,separatedSnippetsLength);
  const lengthDescription = indexDescription.length;
  // get body position = slice(#.position + 2, next #.position
  const indexBody = getBodyPositions(indexDescription,lengthDescription,separatedSnippetsLength)
  const lengthBody = indexBody.length;

  // process body = add different number of spaces according to positions
  // if = for each chunk start + 2 spaces otherwise + 4 spaces
  for (let i = 0; i < lengthBody; i+=2) {
    // loop each chunk
    for (let j = indexBody[i]; j <= indexBody[i+1]; j++) {
      if (j === indexBody[i] && j !== separatedSnippetsLength-1) {
        separatedSnippets[j] = "  \"" + separatedSnippets[j]+"\",";
      } else if (j < indexBody[i+1]) {
        separatedSnippets[j] = "    \"" + separatedSnippets[j]+"\",";
      } else {
        separatedSnippets[j] = "    \"" + separatedSnippets[j]+"\"";
      }
    }
  }
  // console.log(separatedSnippets);

// define newCodeSnippets
  newCodeArea.value = "";

  for (let i = 0; i < lengthBody; i+=2) {
    // add , to end if not the last body
    if (i !== lengthBody - 2) {
    newCodeArea.value += `"${separatedSnippets[indexBody[i]-2].slice(2,)}": {
  "prefix": "${separatedSnippets[(indexBody[i]-1)]}",
  "body": [
  ${separatedSnippets.slice(indexBody[i],indexBody[i+1]+1).join('\n')}
  ],
  "description": "${separatedSnippets[indexBody[i]-2].slice(3,)}"
},\n`;
// last body
    } else {
          newCodeArea.value += `"${separatedSnippets[indexBody[i]-2].slice(2,)}": {
  "prefix": "${separatedSnippets[(indexBody[i]-1)]}",
  "body": [
  ${separatedSnippets.slice(indexBody[i],indexBody[i+1]+1).join('\n')}
  ],
  "description": "${separatedSnippets[indexBody[i]-2].slice(2,)}"
}`;
    }

  }

}