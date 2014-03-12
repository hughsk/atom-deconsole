var deconsole = require('deconsole')
var falafel = require('falafel')

exports.activate = function() {
  atom.workspaceView.command('deconsole:remove-console-logs'
    , removeConsoleLogs
  )
}

function removeConsoleLogs() {
  var editor = atom.workspace.getActiveEditor()
  var selection = editor.getSelection()
  var buffer = editor.getBuffer()
  var text = buffer.cachedText || buffer.getText()

  if (text === null) return
  if (text.indexOf('console') === -1) return

  var selections = editor.getSelections()
  if (!selections.length) return

  var update = text
  var lastRange

  selections.map(function(selection) {
    var range = lastRange = selection.getBufferRange()
    var selectionRange = !(
      range.start.row === range.end.row &&
      range.start.column === range.end.column
    ) && range

    update = deconsole(update, {
      range: selectionRange && [
        selectionRange.start,
        selectionRange.end
      ]
    })
  })

  if (
    update == null ||
    update.trim() === 'null'
  ) return

  buffer.setText(update)
  selection.setBufferRange(lastRange)
}
