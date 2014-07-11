name = '&lt;anon&gt;'

htmlEntities = (string) ->
	String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

pageTitleNotification =
	vars:
		originalTitle: document.title
		interval: null
	on: (notification, intervalSpeed = 1000) ->
		that = this
		that.vars.interval = setInterval ->
			document.title = if that.vars.originalTitle is document.title then notification else that.vars.originalTitle
		, intervalSpeed
		yes
	off: ->
		clearInterval(this.vars.interval)
		document.title = this.vars.originalTitle
		yes

$ ->
	$window = $(window)
	windowFocus = yes
	socket = io.connect(window.location.origin)
	messages = []
	$joinGame = $('#join-game')
	$username = $('#username')
	$joinButton = $('#join')
	$playGame = $('#play-game')
	$content = $('#content')
	$name = $('#name')
	$field = $('#field')
	$sendButton = $('#send')

	$window.on 'focus', (event) ->
		windowFocus = yes
		pageTitleNotification.off()
		yes

	$window.on 'blur', (event) ->
		windowFocus = no
		yes

	socket.on 'message', (data) ->
		if data.message
			messages.push(data)
			html = ''
			for i in [0...messages.length]
				html += "<strong>#{htmlEntities(if messages[i].username then messages[i].username else 'Server')}:</strong> "
				html += "#{htmlEntities(messages[i].message)}<br>"
			$content.html(html)
			$content.scrollTop($content[0].scrollHeight)
			if data.username and data.username isnt $name.val() and not windowFocus
				pageTitleNotification.off()
				pageTitleNotification.on(data.username + " says " + data.message, 1500)
		else
			console.log("There is a problem: #{data}")
		yes

	joinGame = ->
		if $username.val() is ''
			alert('Please type your name!')
		else
			name = $username.val()
			$name.html(name)
			socket.emit('send', {message: "#{name} just joined the chat"})
			$joinGame.collapse('hide')
			$playGame.collapse('show')
			$field.trigger('focus')
		yes

	$joinButton.on 'click', (event) ->
		joinGame()
		yes

	$username.on 'keydown', (event) ->
		if event.keyCode is 13
			joinGame()
		yes

	sendMessage = ->
		if name is ''
			alert('Please type your name!')
		else
			text = $field.val()
			socket.emit('send', {username: name, message: text})
			$field.val('')
		yes

	$sendButton.on 'click', (event) ->
		sendMessage()
		yes

	$field.on 'keydown', (event) ->
		if event.keyCode is 13
			sendMessage()
		yes

	$username.trigger('focus')

	return
