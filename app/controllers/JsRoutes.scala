package controllers

import play.api.Routes
import play.api.mvc.{Action, Controller}

object JsRoutes extends Controller {
	def javascriptRoutes = Action { implicit request =>
		val routes = Routes.javascriptRouter("jsroutes")(
			controllers.api.routes.javascript.Root.whoami,
			controllers.api.routes.javascript.Tokens.create
		)
		Ok(routes).as(JAVASCRIPT)
	}
}
