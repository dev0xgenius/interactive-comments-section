export default function Modal(props) {
	return props.isOpen ? (
		<div
			className="fixed z-20 flex items-center justify-center
      h-screen w-screen px-5 modal-bg"
		>
			<div className="modal rounded-md max-w-sm bg-white-100 p-6">
				<div className="container max-w-max grid gap-4">
					<h1 className="text-left font-bold text-2xl text-blue-600">
						{props.headerMsg}
					</h1>
					<main>
						<p className="text-blue-500">{props.mainMsg}</p>
					</main>
					<footer className="w-full">
						<div className="container w-full flex gap-4">
							<button
							  onClick={() => props.handleResponse(false)}
								className="bg-blue-500 text-white-100
                rounded-md px-5 py-2.5 font-semibold"
							>
								NO, CANCEL
							</button>
							<button
							  onClick={() => props.handleResponse(true)}
								className="bg-red-100 text-white-100
                rounded-md px-5 py-2.5 font-semibold"
							>
								YES, CONTINUE
							</button>
						</div>
					</footer>
				</div>
			</div>
		</div>
	) : (
		<></>
	);
}
