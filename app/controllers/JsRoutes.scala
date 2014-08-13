package controllers

import play.api.Routes
import play.api.mvc.{Action, Controller}

object JsRoutes extends Controller {
	def javascriptRoutes = Action { implicit request =>
		val routes = Routes.javascriptRouter("jsroutes")(
			controllers.api.routes.javascript.Root.whoami,

			controllers.api.routes.javascript.Tokens.list,
			controllers.api.routes.javascript.Tokens.create,
			controllers.api.routes.javascript.Tokens.delete,
			controllers.api.routes.javascript.Tokens.rename,

			controllers.api.routes.javascript.Emails.list
		)
		Ok(routes).as(JAVASCRIPT)
	}
}
