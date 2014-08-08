package controllers

package object api {
	implicit val executionContext = play.api.libs.concurrent.Execution.Implicits.defaultContext
}
