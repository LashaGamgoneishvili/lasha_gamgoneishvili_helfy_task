import React from "react";
import {
  TASK_DESCRIPTION_MAX_LENGTH,
  TASK_TITLE_MAX_LENGTH,
} from "../../utils/taskValidation";

interface TaskFormFieldsProps {
  title: string;
  description: string;
  titleError?: string;
  descriptionError?: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export const TaskFormFields: React.FC<TaskFormFieldsProps> = ({
  title,
  description,
  titleError,
  descriptionError,
  onTitleChange,
  onDescriptionChange,
}) => (
  <>
    <div className="form-group">
      <input
        type="text"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className={`title-input ${titleError ? "field-input-error" : ""}`}
        maxLength={TASK_TITLE_MAX_LENGTH}
        required
      />
      {titleError && <span className="field-error-text">{titleError}</span>}
    </div>

    <div className="form-group">
      <textarea
        placeholder="Add a description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className={`desc-input ${descriptionError ? "field-input-error" : ""}`}
        maxLength={TASK_DESCRIPTION_MAX_LENGTH}
        required
      />
      {descriptionError && (
        <span className="field-error-text">{descriptionError}</span>
      )}
    </div>
  </>
);
